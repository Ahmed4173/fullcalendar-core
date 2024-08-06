using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace fullcalendarcore.Library
{
    public class Event
    {
        public int EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public bool AllDay { get; set; }

        public string EventType { get; set; }
        public string Organizer { get; set; }
        public string Atandee { get; set; }
        public string Location { get; set; }

        public int NoOfAtande { get; set; }

    }
    public class Attendee
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }


}
