package routes

import (
	"net/http"

	"github.com/AlexGalhardo/vukem/inertia"
	"github.com/AlexGalhardo/vukem/web"

	"github.com/AlexGalhardo/vukem-studio/app/accounts"
)

// allowlisted ends the session of a signed-in user whose email is not in
// accounts.AllowedEmails (an account from before the allowlist). Run it after
// auth.Required.
func allowlisted(acc *accounts.Accounts) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c := web.NewCtx(w, r, web.ServicesFrom(r.Context()))

			u, err := acc.Web.User(c)
			if err != nil || accounts.Allowed(u.Email) {
				next.ServeHTTP(w, r)

				return
			}

			_ = acc.Web.Logout(c)

			if c.WantsJSON() {
				_ = c.JSON(http.StatusForbidden, map[string]any{"message": "This account is not allowed."})

				return
			}

			inertia.Flash(c, "error", "This Google account is not allowed to use Studio.")
			_ = c.Redirect("/login")
		})
	}
}
