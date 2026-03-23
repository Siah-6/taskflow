import { useState } from "react";

function TaskForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    status: initialData.status || "To Do",
  });

  const [errors, setErrors] = useState({});

  const statusOptions = ["To Do", "In Progress", "Completed"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }
    if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {initialData._id ? "Edit Task" : "Create New Task"}
        </h3>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title..."
          className={`input-field ${errors.title ? "border-red-300 focus:ring-red-500" : ""}`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)..."
          rows={4}
          className={`input-field ${errors.description ? "border-red-300 focus:ring-red-500" : ""}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          {formData.description.length}/500 characters
        </p>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="input-field"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData._id ? "Update Task" : "Create Task"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;
