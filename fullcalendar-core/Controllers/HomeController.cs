using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using fullcalendarcore.Models;
using Microsoft.Extensions.Options;
using fullcalendarcore.DataAccessLayer;
using fullcalendarcore.Library;

namespace fullcalendarcore.Controllers
{
    public class HomeController : Controller
    {
        private DA _DA { get; set; }

        public HomeController(IOptions<AppSettings> settings)
        {
            _DA = new DA(settings.Value.ConnectionStr);
        }

        public IActionResult Index() 
        {
            return View();
        }

        public IActionResult ManageBookings(int eventId)
        {
            // Logic to get the URL based on eventId
            string redirectUrl = _DA.GetBookingManagementUrl(eventId);

            if (!string.IsNullOrEmpty(redirectUrl))
            {
                return Json(new { redirectUrl });
            }
            else
            {
                return Json(new { redirectUrl = "" });
            }
        }



        [HttpGet]
        public IActionResult GetCalendarEvents(string start, string end)
        {
            List<Event> events = _DA.GetCalendarEvents(start, end);

            return Json(events);
        }

        public IActionResult GetAttendees(int eventId)
        {
            var attendees = new List<Attendee>
    {
        new Attendee { Name = "John", Surname = "Doe", Email = "john.doe@example.com", Phone = "123-456" },
        new Attendee { Name = "Jane", Surname = "Smith", Email = "jane.smith@example.com", Phone = "098-765" }
    };

            return Json(new { attendees });
        }




        //[HttpPost]
        //public IActionResult UpdateEvent([FromBody] Event evt) 
        //{
        //    string message = String.Empty;

        //    message = _DA.UpdateEvent(evt);

        //    return Json(new { message });
        //}

        //[HttpPost]
        //public IActionResult AddEvent([FromBody] Event evt) 
        //{
        //    string message = String.Empty;
        //    int eventId = 0;

        //    message = _DA.AddEvent(evt, out eventId);

        //    return Json(new { message, eventId });
        //}

        //[HttpPost]
        //public IActionResult DeleteEvent([FromBody] Event evt) {
        //    string message = String.Empty;

        //    message = _DA.DeleteEvent(evt.EventId);

        //    return Json(new { message });
        //}

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() 
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
