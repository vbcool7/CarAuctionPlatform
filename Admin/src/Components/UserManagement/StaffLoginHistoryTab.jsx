
import {
  Monitor,
  Smartphone,
  Globe,
  ShieldCheck,
} from "lucide-react";

const historyData = [
  {
    id: 1,
    date: "May 20, 2024",
    time: "09:15 AM",
    current: true,

    ip: "197.210.45.23",

    flag: "🇦🇪",
    location: "Dubai, UAE",
    country: "(AE)",

    browserIcon: <Monitor size={18} className="text-blue-500" />,
    browser: "Chrome 124.0",
    device: "Desktop",

    os: "Windows 11",

    status: "Success",
    message: "",

    loginType: "Web",
  },

  {
    id: 2,
    date: "May 19, 2024",
    time: "06:42 PM",
    current: false,

    ip: "197.210.45.23",

    flag: "🇦🇪",
    location: "Dubai, UAE",
    country: "(AE)",

    browserIcon: <Monitor size={18} className="text-blue-500" />,
    browser: "Chrome 123.0",
    device: "Desktop",

    os: "Windows 11",

    status: "Success",
    message: "",

    loginType: "Web",
  },

  {
    id: 3,
    date: "May 19, 2024",
    time: "09:18 AM",
    current: false,

    ip: "102.168.15.78",

    flag: "🇦🇪",
    location: "Sharjah, UAE",
    country: "(AE)",

    browserIcon: <Smartphone size={18} className="text-sky-500" />,
    browser: "Safari 17.4",
    device: "iPhone",

    os: "iOS 17.4",

    status: "Success",
    message: "",

    loginType: "Mobile App",
  },

  {
    id: 4,
    date: "May 18, 2024",
    time: "08:55 PM",
    current: false,

    ip: "185.162.32.11",

    flag: "🇦🇪",
    location: "Abu Dhabi, UAE",
    country: "(AE)",

    browserIcon: <Globe size={18} className="text-orange-500" />,
    browser: "Firefox 125.0",
    device: "Desktop",

    os: "Windows 10",

    status: "Success",
    message: "",

    loginType: "Web",
  },

  {
    id: 5,
    date: "May 18, 2024",
    time: "02:31 PM",
    current: false,

    ip: "102.168.15.78",

    flag: "🇦🇪",
    location: "Sharjah, UAE",
    country: "(AE)",

    browserIcon: <Smartphone size={18} className="text-sky-500" />,
    browser: "Safari 17.4",
    device: "iPhone",

    os: "iOS 17.4",

    status: "Failed",
    message: "Wrong password",

    loginType: "Mobile App",
  },

  {
    id: 6,
    date: "May 17, 2024",
    time: "11:05 AM",
    current: false,

    ip: "197.210.45.23",

    flag: "🇦🇪",
    location: "Dubai, UAE",
    country: "(AE)",

    browserIcon: <Monitor size={18} className="text-blue-500" />,
    browser: "Chrome 123.0",
    device: "Desktop",

    os: "Windows 11",

    status: "Success",
    message: "",

    loginType: "Web",
  },

  {
    id: 7,
    date: "May 16, 2024",
    time: "07:48 PM",
    current: false,

    ip: "203.0.113.45",

    flag: "🇬🇧",
    location: "London, UK",
    country: "(GB)",

    browserIcon: <Monitor size={18} className="text-cyan-500" />,
    browser: "Edge 123.0",
    device: "Desktop",

    os: "Windows 11",

    status: "Failed",
    message: "Account locked",

    loginType: "Web",
  },

  {
    id: 8,
    date: "May 16, 2024",
    time: "07:40 PM",
    current: false,
    ip: "203.0.113.45",
    flag: "🇬🇧",
    location: "London, UK",
    country: "(GB)",
    browserIcon: <Monitor size={18} className="text-cyan-500" />,
    browser: "Edge 123.0",
    device: "Desktop",
    os: "Windows 11",
    status: "Failed",
    message: "Wrong password",
    loginType: "Web",
  },
];

function StaffLoginHistoryTab() {
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-bold text-slate-900">Login History</h2>
          <p className="text-[13px] text-slate-500 mt-1">View login attempts and device information for this staff member.</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">

          {/* Header */}
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-[11px] font-bold uppercase text-slate-500">

              <th className="px-5 py-4 text-left min-w-42">Login Time</th>

              <th className="px-5 py-4 text-left min-w-35">IP Address</th>

              <th className="px-5 py-4 text-left min-w-45">Location</th>

              <th className="px-5 py-4 text-left min-w-50">Device / Browser</th>

              <th className="px-5 py-4 text-left min-w-33">OS</th>

              <th className="px-4 py-4 text-center min-w-30">Status</th>

              <th className="px-4 py-4 text-center min-w-30">Login Type</th>

            </tr>
          </thead>

          {/* Body */}
          <tbody>

            {historyData.map((row) => (

              <tr
                key={row.id}
                className="border-b border-slate-100 hover:bg-slate-50 transition"
              >

                {/* Login Time */}
                <td className="px-4 py-4">

                  <p className="font-semibold text-slate-900">
                    {row.date} {row.time}
                  </p>

                  {row.current && (
                    <p className="mt-1 text-xs font-medium text-green-600">
                      (Current Session)
                    </p>
                  )}

                </td>

                {/* IP */}
                <td className="px-4 py-4 font-medium text-slate-700">
                  {row.ip}
                </td>

                {/* Location */}
                <td className="px-4 py-4">

                  <div className="flex items-start gap-2">

                    <span className="text-lg">
                      {row.flag}
                    </span>

                    <div>

                      <p className="font-medium text-slate-900">
                        {row.location}
                      </p>

                      <p className="text-xs text-slate-500">
                        {row.country}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Browser */}
                <td className="px-4 py-4">

                  <div className="flex items-start gap-3">

                    {row.browserIcon}

                    <div>

                      <p className="font-medium text-slate-900">
                        {row.browser}
                      </p>

                      <p className="text-xs text-slate-500">
                        {row.device}
                      </p>

                    </div>

                  </div>

                </td>

                {/* OS */}
                <td className="px-4 py-4 text-slate-700 font-medium">
                  {row.os}
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center">

                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold ${row.status === "Success"
                      ? "bg-green-50 text-green-600"
                      : "bg-red-50 text-red-600"
                      }`}
                  >
                    {row.status}
                  </span>

                  {row.message && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {row.message}
                    </p>
                  )}

                </td>

                {/* Login Type */}
                <td className="px-4 py-4 text-center">

                  <span
                    className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold ${row.loginType === "Web"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                      }`}
                  >
                    {row.loginType}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default StaffLoginHistoryTab;