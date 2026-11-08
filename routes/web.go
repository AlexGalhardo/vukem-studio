package routes

import (
	"net/http"

	vukem "github.com/AlexGalhardo/vukem"
	"github.com/AlexGalhardo/vukem/errs"
	"github.com/AlexGalhardo/vukem/inertia"
	"github.com/AlexGalhardo/vukem/middleware"
	"github.com/AlexGalhardo/vukem/router"
	"github.com/AlexGalhardo/vukem/web"

	"github.com/AlexGalhardo/vukem-studio/resources"
)

// Web registers the browser routes. vukem route:list shows them.
func Web(r *router.Router, app *vukem.App) error {
	if err := vukem.DefaultMiddleware(app, r); err != nil {
		return err
	}

	r.UseServer(middleware.Gzip()) // proxies in front of the app may not compress
	r.UseServer(middleware.StaticFS(resources.Public(), middleware.StaticConfig{Prefix: "/"}))
	// Only the ui.* keys reach the browser; auth.* messages stay on the server.
	r.Use(app.Inertia.Middleware, inertia.I18n("ui."), shareProps(app))

	// The language switcher stores the choice in the lang cookie, which
	// i18n.Middleware reads on every request.
	r.Post("/locale", func(c *web.Ctx) error {
		// Input, not FormValue: Inertia's router.post sends a JSON body.
		in, err := c.Input()
		if err != nil {
			return err
		}

		tag, _ := in["locale"].(string)

		l, ok := app.I18n.Match(tag)
		if !ok {
			return errs.ErrNotFound
		}

		c.SetCookie(&http.Cookie{
			Name:     "lang",
			Value:    l,
			Path:     "/",
			MaxAge:   365 * 24 * 3600,
			HttpOnly: true,
			Secure:   app.Config.IsProduction(),
			SameSite: http.SameSiteLaxMode,
		})

		return c.Back("/")
	}).Name("locale.update")

	return nil
}

// shareProps adds the props every page receives (usePage().props).
func shareProps(app *vukem.App) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			inertia.Share(r.Context(), "appName", app.Config.Name)

			// The shadcn sidebar stores open/closed in this cookie; sharing it lets SSR
			// render a hidden sidebar hidden, without a flash on reload.
			ck, err := r.Cookie("sidebar_state")
			inertia.Share(r.Context(), "sidebarOpen", err != nil || ck.Value != "false")
			next.ServeHTTP(w, r)
		})
	}
}
