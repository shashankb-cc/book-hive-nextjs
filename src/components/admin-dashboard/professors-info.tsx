"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, Plus, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { deleteProfessor, handleCalendlyStatus } from "@/actions/professorActions";
import { IProfessor } from "@/lib/models";

interface ProfessorDashboardProps {
  professors: IProfessor[];
}

export default function ProfessorDashboard({
  professors: initialProfessors,
}: ProfessorDashboardProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [professors, setProfessors] = useState(initialProfessors);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProfessor, setLoadingProfessor] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const result = await deleteProfessor(id);
    if ("error" in result) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: result.message || "Professor deleted successfully",
        className: "bg-green-800",
      });
      setProfessors(professors.filter((prof) => prof.id !== id));
    }
  };

  const handleCheckStatus = async (professor: IProfessor) => {
    setLoadingProfessor(professor.id);
    try {
      const result = await handleCalendlyStatus(professor.id, professor.email);
      if (result.success) {
        setProfessors((prevProfessors) =>
          prevProfessors.map((prof) =>
            prof.id === professor.id
              ? { ...prof, calendly_link: result.calendlyLink }
              : prof
          )
        );
        toast({
          title: "Success",
          description: "Calendly link updated successfully",
          className: "bg-green-400 text-white",
        });
      } else {
        toast({
          title: "Information",
          description: result.message,
          className: "bg-blue-400 text-white",
        });
      }
    } catch (error) {
      console.error("Error checking invitation status:", error);
      toast({
        title: "Error",
        description: "Failed to check invitation status",
        variant: "destructive",
      });
    } finally {
      setLoadingProfessor(null);
    }
  };

  const filteredProfessors = professors.filter(
    (professor) =>
      professor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professor.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Professor Management
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Input
              type="text"
              placeholder="Search professors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-auto"
            />
            <Link href="/admin-dashboard/professors/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Professor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Professors</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProfessors.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    
                    <TableHead>Schedule / Check Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfessors.map((professor) => (
                    <TableRow key={professor.id}>
                      <TableCell>{professor.name}</TableCell>
                      <TableCell>{professor.department}</TableCell>
                      
                      <TableCell>
                        {professor.calendly_link ? (
                          <Button
                            onClick={() =>
                              window.open(professor?.calendly_link!, "_blank")
                            }
                            size="sm"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Meeting
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleCheckStatus(professor)}
                            size="sm"
                            disabled={loadingProfessor === professor.id}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {loadingProfessor === professor.id
                              ? "Checking..."
                              : "Check Status"}
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin-dashboard/professors/${professor.id}/update`}
                          >
                            <Button variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the professor &quot;
                                  {professor.name}&quot; from the database.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(professor.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No professors found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
