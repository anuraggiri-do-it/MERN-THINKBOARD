import { ArrowLeftIcon } from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import api from "../lib/axios";
import { useAuth } from "../lib/auth";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("Please log in to create notes");
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please log in to create notes");
        navigate("/login");
        return;
      }

      console.log("Creating note with token:", token ? "Token exists" : "No token");
      
      const response = await api.post("/notes", {
        title,
        content,
      });

      console.log("Note created successfully:", response.data);
      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating note:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
        
        if (error.response.status === 401) {
          toast.error("Please log in to create notes");
          localStorage.removeItem('token');
          navigate("/login");
        } else if (error.response.status === 500) {
          toast.error(error.response.data?.message || "Server error occurred");
        } else {
          toast.error(error.response.data?.message || "Failed to create note");
        }
      } else if (error.request) {
        // Network error
        console.error("Network error:", error.request);
        toast.error("Network error - please check your connection");
      } else {
        // Other error
        console.error("Error:", error.message);
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className="size-5" />
            Back to Notes
          </Link>

          <div className="card bg-base-100">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Create New Note</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Note Title"
                    className="input input-bordered"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>
                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered h-32"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CreatePage;