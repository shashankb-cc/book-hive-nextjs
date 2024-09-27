"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  BookOpen,
  Link as LinkIcon,
  Mail,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { IProfessor } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { createProfessor, handleCalendlyStatus, updateProfessor } from "@/actions/professorActions";

interface ProfessorFormProps {
  professor?: IProfessor;
}

export default function ProfessorForm({ professor }: ProfessorFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: professor?.id || 0,
    name: professor?.name || "",
    department: professor?.department || "",
    bio: professor?.bio || "",
    calendly_link: professor?.calendly_link || "",
    email: professor?.email || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData(e.currentTarget);

    try {
      const action = professor ? updateProfessor : createProfessor;
      const result = await action(formDataToSend);

      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description:
            result.message ||
            (professor
              ? "Professor updated successfully"
              : "Professor created successfully and invitation sent"),
          className: "bg-green-400 text-white",
        });
        router.push("/admin-dashboard/professors");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {professor ? "Edit Professor" : "Add New Professor"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {professor && <input type="hidden" name="id" value={professor.id} />}
          <div>
            <Label htmlFor="name">Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Professor Name"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="department">Department</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Professor's bio"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@mail.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="calendly_link">Calendly Link</Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="calendly_link"
                name="calendly_link"
                type="text"
                value={formData.calendly_link}
                onChange={handleChange}
                placeholder="https://calendly.com/your-link"
                className="pl-10"
                readOnly
              />
            </div>
          </div>


          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {professor ? "Update Professor" : "Add Professor"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
