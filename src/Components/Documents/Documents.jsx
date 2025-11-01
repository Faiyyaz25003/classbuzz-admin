// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Eye } from "lucide-react";

// export default function Documents() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     const fetchDocuments = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/documents");
//         setUsers(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchDocuments();
//   }, []);

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4 text-center">
//         All Uploaded Documents
//       </h2>
//       <div className="grid gap-4">
//         {users.map((user) => (
//           <div key={user._id} className="border p-4 rounded shadow">
//             <h3 className="font-semibold">{user.name}</h3>
//             <div className="flex gap-4 mt-2">
//               {user.aadhaar && (
//                 <a
//                   href={`http://localhost:5000/${user.aadhaar}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-500"
//                 >
//                   <Eye size={16} /> Aadhaar
//                 </a>
//               )}
//               {user.marksheet && (
//                 <a
//                   href={`http://localhost:5000/${user.marksheet}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-500"
//                 >
//                   <Eye size={16} /> Marksheet
//                 </a>
//               )}
//               {user.photo && (
//                 <a
//                   href={`http://localhost:5000/${user.photo}`}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="text-blue-500"
//                 >
//                   <Eye size={16} /> Photo
//                 </a>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { Eye, FileText, Image, CreditCard, User } from "lucide-react";

export default function Documents() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/documents");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Uploaded Documents
          </h2>
          <p className="text-gray-600">View and manage all user documents</p>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-500 text-lg">No documents uploaded yet</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white rounded-full p-2">
                      <User className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-white truncate">
                      {user.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {user.aadhaar && (
                    <a
                      href={`http://localhost:5000/${user.aadhaar}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group"
                    >
                      <div className="bg-emerald-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
                        <CreditCard className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">
                          Aadhaar Card
                        </p>
                        <p className="text-xs text-gray-500">View document</p>
                      </div>
                      <Eye
                        className="text-emerald-600 group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </a>
                  )}

                  {user.marksheet && (
                    <a
                      href={`http://localhost:5000/${user.marksheet}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-200 group"
                    >
                      <div className="bg-amber-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
                        <FileText className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">Marksheet</p>
                        <p className="text-xs text-gray-500">View document</p>
                      </div>
                      <Eye
                        className="text-amber-600 group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </a>
                  )}

                  {user.photo && (
                    <a
                      href={`http://localhost:5000/${user.photo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 group"
                    >
                      <div className="bg-purple-500 rounded-lg p-2 group-hover:scale-110 transition-transform">
                        <Image className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-700">Photo</p>
                        <p className="text-xs text-gray-500">View document</p>
                      </div>
                      <Eye
                        className="text-purple-600 group-hover:translate-x-1 transition-transform"
                        size={20}
                      />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}