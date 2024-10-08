import { useQuery } from "@tanstack/react-query";
import { getJobVacancies } from "@/services/career.service";
import { Job } from "@/interface/jobs.interface";

export function useCareerData() {
  return useQuery<Job[]>(["getCareerData"], getJobVacancies);
}
