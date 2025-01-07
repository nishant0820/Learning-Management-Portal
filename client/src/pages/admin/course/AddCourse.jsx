import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse, {data, isLoading, error, isSuccess}] = useCreateCourseMutation();

    const navigate = useNavigate();
    
    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createCourseHandler = async () => {
        await createCourse({courseTitle, category});
    }

    useEffect(() => {
      if(isSuccess){
        toast.success(data?.message || "Course created successfully");
        navigate("/admin/course");
      }
    },[isSuccess, error])
  return (
    <div className="flex-1 mx-10">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Let's add course, add some basic course details
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
          doloribus.
        </p>
      </div>
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course title"
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Nextjs">Nextjs</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                <SelectItem value="Backend Development">Backend Development</SelectItem>
                <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                <SelectItem value="API Creation">API Creation</SelectItem>
                <SelectItem value="MERN">MERN</SelectItem>
                <SelectItem value="Cloud Computing">Cloud Computing</SelectItem>
                <SelectItem value="Database">Database</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/course")}>Back</Button>
            <Button disabled={isLoading} onClick={createCourseHandler}>
                {
                    isLoading ? (
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait...
                        </>
                    ) : "Create"
                }
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
