import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";

export default function Documents() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/documents");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocuments();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-center">
        All Uploaded Documents
      </h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="border p-4 rounded shadow">
            <h3 className="font-semibold">{user.name}</h3>
            <div className="flex gap-4 mt-2">
              {user.aadhaar && (
                <a
                  href={`http://localhost:5000/${user.aadhaar}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  <Eye size={16} /> Aadhaar
                </a>
              )}
              {user.marksheet && (
                <a
                  href={`http://localhost:5000/${user.marksheet}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  <Eye size={16} /> Marksheet
                </a>
              )}
              {user.photo && (
                <a
                  href={`http://localhost:5000/${user.photo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500"
                >
                  <Eye size={16} /> Photo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
