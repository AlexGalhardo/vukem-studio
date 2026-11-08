package tests

import (
	"net/http"
	"testing"

	"github.com/AlexGalhardo/vukem/vukemtest"

	"github.com/AlexGalhardo/vukem-studio/bootstrap"
)

func TestLocaleSwitchStoresTheChoice(t *testing.T) {
	t.Parallel()

	app := vukemtest.New(t, bootstrap.New)
	c := app.Client(t).Inertia("")

	google := func(page map[string]any) any {
		props, _ := page["props"].(map[string]any)
		messages, _ := props["messages"].(map[string]any)

		return messages["ui.login.google"]
	}

	en := c.Get("/login").AssertInertia("Auth/Login").PropEquals("locale", "en").Page()
	if got := google(en); got != "Continue with Google" {
		t.Fatalf("en ui.login.google = %v", got)
	}

	c.PostJSON("/locale", map[string]any{"locale": "pt-BR"}).AssertRedirect("/")

	pt := c.Get("/login").AssertInertia("Auth/Login").PropEquals("locale", "pt-BR").Page()
	if got := google(pt); got != "Continuar com Google" {
		t.Fatalf("pt-BR ui.login.google = %v", got)
	}
}

func TestLocaleSwitchRejectsUnknownLocales(t *testing.T) {
	t.Parallel()

	app := vukemtest.New(t, bootstrap.New)
	c := app.Client(t).Inertia("")

	c.PostJSON("/locale", map[string]any{"locale": "xx-YY"}).AssertStatus(http.StatusNotFound)
	c.Get("/login").AssertInertia("Auth/Login").PropEquals("locale", "en")
}

func TestDashboardLivesAtTheRoot(t *testing.T) {
	t.Parallel()

	app := vukemtest.New(t, bootstrap.New)

	app.Client(t).Get("/dashboard").AssertStatus(http.StatusMovedPermanently).AssertHeader("Location", "/")
	app.Client(t).Get("/").AssertRedirect("/login")
}

func TestSidebarStateIsShared(t *testing.T) {
	t.Parallel()

	app := vukemtest.New(t, bootstrap.New)

	app.Client(t).Inertia("").Get("/login").AssertInertia("Auth/Login").PropEquals("sidebarOpen", true)
	app.Client(t).Inertia("").WithHeader("Cookie", "sidebar_state=false").
		Get("/login").AssertInertia("Auth/Login").PropEquals("sidebarOpen", false)
}
