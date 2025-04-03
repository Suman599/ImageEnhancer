export const enhancedImageAPI = async (imageFile) => {
    const API_KEY = "wxjm18r7ka0ellrwo";
    const formData = new FormData();
    formData.append("image_file", imageFile);
  
    try {
      // 🟢 Step 1: Create Task
      const response = await fetch("https://techhk.aoscdn.com/api/tasks/visual/scale", {
        method: "POST",
        headers: {
          "X-API-KEY": API_KEY,
        },
        body: formData,
      });
  
      const data = await response.json();
      if (!data?.data?.task_id) throw new Error("Task creation failed.");
  
      const taskId = data.data.task_id;
  
      // 🟢 Step 2: Poll for enhanced image result
      return await pollForResult(taskId, API_KEY);
    } catch (error) {
      console.error("Enhance Image API Error:", error);
      throw error;
    }
  };
  
  // 🟢 Polling function to check task status
  const pollForResult = async (taskId, API_KEY, retries = 30, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));
  
      const response = await fetch(`https://techhk.aoscdn.com/api/tasks/visual/scale/${taskId}`, {
        method: "GET",
        headers: {
          "X-API-KEY": API_KEY,
        },
      });
  
      const data = await response.json();
      if (data?.data?.progress >= 100) return data.data;
  
      console.log(`Polling attempt ${i + 1}...`);
    }
  
    throw new Error("Image enhancement timed out.");
  };
  