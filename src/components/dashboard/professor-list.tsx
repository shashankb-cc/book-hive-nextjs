'use client'

import { SetStateAction, useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, GraduationCap, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { getProfessors } from "@/actions/professorActions"
import { IProfessor } from "@/lib/models"
import { CalendlyModal } from "@/components/dashboard/calendly-modal"
import { useTranslations } from "next-intl"

export default function ProfessorList() {
  const t = useTranslations("ProfessorList")
  const [professors, setProfessors] = useState<IProfessor[]>([])
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("")
  const [selectedProfessor, setSelectedProfessor] = useState<IProfessor | null>(null)

  const fetchProfessors = async () => {
    const result = await getProfessors()
    if ("error" in result) {
      setError(result.error)
    } else {
      setProfessors(result)
    }
  }

  useEffect(() => {
    fetchProfessors()
  }, [search, department])

  const handleSearchChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearch(e.target.value)
  }

  const handleDepartmentChange = (value: SetStateAction<string>) => {
    setDepartment(value)
  }

  const handleCloseModal = () => {
    setSelectedProfessor(null)
  }

  const handleSchedule = (professor: IProfessor) => {
    setSelectedProfessor(professor)
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 text-xl max-w-3xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Label htmlFor="search" className="text-lg font-semibold mb-2">{t("searchLabel")}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="search"
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* <div className="w-full md:w-64">
            <Label htmlFor="department" className="text-lg font-semibold mb-2">{t("departmentLabel")}</Label>
            <Select onValueChange={handleDepartmentChange} value={department}>
              <SelectTrigger id="department" className="border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <SelectValue placeholder={t("departmentPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allDepartments")}</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {professors.map((professor) => (
            <motion.div
              key={professor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full flex flex-col transition-shadow duration-300 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{professor.name}</CardTitle>
                  <CardDescription className="flex items-center text-lg">
                    <GraduationCap className="mr-2" />
                    {professor.department}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 dark:text-gray-300">{professor.bio}</p>
                </CardContent>
                <CardFooter>
                  {professor.calendly_link ? (
                    <Link
                      href={`/professors/${professor.id}/schedule`}
                      className="inline-flex items-center justify-center w-full rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2"
                    >
                      <Calendar className="mr-2" />
                      {t("scheduleMeeting")}
                    </Link>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("noCalendlyLink")}
                    </p>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedProfessor && (
        <CalendlyModal
          isOpen={!!selectedProfessor}
          onClose={handleCloseModal}
          calendlyLink={selectedProfessor.calendly_link ?? ""}
          professorName={selectedProfessor.name}
        />
      )}
    </div>
  )
}