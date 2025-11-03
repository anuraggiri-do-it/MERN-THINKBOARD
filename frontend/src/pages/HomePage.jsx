import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import { Trash2Icon, EditIcon } from "lucide-react";
import { useAuth } from "../lib/auth";

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to delete notes");
        navigate("/login");
        return;
      }

      console.log("Deleting note:", id);
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.status === 401) {
          toast.error("Please log in to delete notes");
          localStorage.removeItem('token');
          navigate("/login");
        } else if (error.response.status === 403) {
          toast.error("You don't have permission to delete this note");
        } else if (error.response.status === 404) {
          toast.error("Note not found");
          // Remove from local state if it doesn't exist
          setNotes(notes.filter(note => note._id !== id));
        } else {
          toast.error(error.response.data?.message || "Failed to delete note");
        }
      } else {
        toast.error("Network error - please check your connection");
      }
    }
  };

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      toast.error("Please log in to view your notes");
      navigate("/login");
      return;
    }

    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error("Please log in to view your notes");
          navigate("/login");
          return;
        }

        console.log("Fetching user notes...");
        const res = await api.get("/notes/my");
        console.log("Notes fetched:", res.data.length);
        setNotes(res.data);
      } catch (error) {
        console.error("Error fetching notes:", error);
        
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
          
          if (error.response.status === 401) {
            toast.error("Please log in to view your notes");
            localStorage.removeItem('token');
            navigate("/login");
          } else {
            toast.error(error.response.data?.message || "Failed to load notes");
          }
        } else {
          toast.error("Network error - please check your connection");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <h1 className="text-3xl font-bold mb-6 text-base-content">My Notes</h1>
        
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
                <div className="h-2 bg-primary rounded-t-lg"></div>
                <div className="card-body">
                  <h2 className="card-title text-base-content text-lg font-semibold">{note.title}</h2>
                  <p className="text-base-content opacity-70 text-sm line-clamp-3">{note.content}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-base-content opacity-50">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/note/${note._id}`} className="btn btn-sm btn-primary">
                        <EditIcon className="w-4 h-4" />
                        Edit
                      </Link>
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
export default HomePage;