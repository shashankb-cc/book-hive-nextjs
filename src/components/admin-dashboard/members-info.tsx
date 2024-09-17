"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pencil, Trash2, Plus } from "lucide-react";
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
import { SearchForm } from "@/components/dashboard/search-form";
import Pagination from "@/components/dashboard/pagination";
import { IMember } from "@/lib/models";
import MemberForm from "@/components/admin-dashboard/member-form";
import { useToast } from "@/hooks/use-toast";
import { createMember, deleteMember, updateMember } from "@/actions/memberActions";

interface MemberDashboardProps {
  members: IMember[];
  currentPage: number;
  totalPages: number;
}

export default function MemberDashboard({
  members,
  currentPage,
  totalPages,
}: MemberDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<IMember | undefined>(
    undefined
  );
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin-dashboard/members?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteMember(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: result.message || "Member deleted successfully",
        className: "bg-green-800",
      });
    }
    router.refresh();
  };

  const handleAdd = () => {
    setSelectedMember(undefined);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedMember(undefined);
  };

  const handleFormSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const action = selectedMember ? updateMember : createMember;
      const result = await action(null, formData);
      if (result.error) {
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
            (selectedMember
              ? "Member updated successfully"
              : "Member added successfully"),
          className: "bg-green-400 text-white",
        });
        closeForm();
      }
      router.refresh();
    });
  };

  return (
    <div className="container mx-auto p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Member Management
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <SearchForm />
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.firstName}</TableCell>
                  <TableCell>{member.lastName}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phoneNumber || "N/A"}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
                              permanently delete the member &quot;
                              {member.firstName} &quot;
                              {member.lastName}&quot; from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(member.id)}
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
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {showForm && (
        <MemberForm
          onClose={closeForm}
          member={selectedMember}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
