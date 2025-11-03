import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Trash2Icon, EyeIcon } from "lucide-react";

const AdminPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  useEffect(() => {
    const fetchAllNotes = async () => {
      try {
        const res = await api.get("/notes/all");
        setNotes(res.data);
      } catch (error) {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <h1 className="text-3xl font-bold mb-6 text-base-content">Admin Panel - All Notes</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <span className="loading loading-ring loading-lg text-primary"></span>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-base-content text-lg">No notes found</div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {notes.map((note) => (
              <div key={note._id} className="card w-96 bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-2 bg-error rounded-t-lg"></div>
                <div className="card-body">
                  <h2 className="card-title text-base-content text-lg font-semibold">{note.title}</h2>
                  <p className="text-base-content opacity-70 text-sm line-clamp-3">{note.content}</p>
                  <div className="text-xs text-primary font-medium">
                    By: {note.user?.username || 'Unknown User'}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-base-content opacity-50">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleDelete(note._id)}
                        className="btn btn-sm btn-error"
                      >
                        <Trash2Icon className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;