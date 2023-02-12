using System.Web.Mvc;

namespace WebAtividadeEntrevista.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Página Inicial";

            return View();
        }
    }
}
