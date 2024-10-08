import { getCookie } from "cookies-next";
import { FileTextIcon } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { applyJob } from "@/services/career.service";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useConfig as useConfigStores } from "@/store/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

// Define the Zod schema
const validationSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  contactNumber: z
    .string()
    .regex(/^9\d{9}$/, "Contact Number must be 10 digits and start with 9")
    .min(1, "Contact Number is required"),
  emailAddress: z.string().email("Invalid email address"),
  location: z.string().min(1, "Location is required"),
  cv: z.any(),
});

type SchemaProps = z.infer<typeof validationSchema>;

const JobApplication = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { configData } = useConfigStores();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const jobTitle = getCookie("job_title");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchemaProps>({
    resolver: zodResolver(validationSchema),
  });

  const CreateMutation = useMutation({
    mutationFn: (data: any) => applyJob(data.id, data.payload),
    onSuccess: (data) => {
      console.log("Application submitted:", data);
    },
    onError: (error: any) => {
      console.log("error:", error);
    },
  });

  const onSubmit = async (data: any) => {
    const fileInput = document.getElementById("cv") as HTMLInputElement;
    if (fileInput?.files?.length) {
      const file = fileInput.files[0];
      if (file.type !== "application/pdf") {
        console.log("Invalid file type. Only PDF is allowed.");
        return;
      }
    }

    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("submit");
    if (token) {
      const payload = {
        fileName: fileInput?.files?.[0],
        email: data.emailAddress,
        full_name: data.fullName,
        address: data.location,
        phone_number: data.contactNumber,
        recaptchaToken: token,
      };
      CreateMutation.mutate({ id: slug, payload });
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white pb-14 -mb-14">
      <Head>
        <title>Apply for Job</title>
      </Head>
      <div className="text-lg my-10">
        <div className="container">
          <Card className="w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl ">
                {isMounted && jobTitle ? `Apply for ${jobTitle}` : ""}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Kindly finalize your registration by providing the necessary
                details.
              </p>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="Name"
                      {...register("fullName")}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <Input
                      type="number"
                      id="contactNumber"
                      placeholder="Contact Number"
                      {...register("contactNumber", {
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Contact Number must be exactly 10 digits",
                        },
                      })}
                      maxLength={10}
                    />
                    {errors.contactNumber && (
                      <p className="text-red-500 text-xs">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input
                      id="emailAddress"
                      type="email"
                      placeholder="Email"
                      {...register("emailAddress")}
                    />
                    {errors.emailAddress && (
                      <p className="text-red-500 text-xs">
                        {errors.emailAddress.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location</Label>
                    <Input
                      id="location"
                      placeholder="Location"
                      {...register("location")}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-xs">
                        {errors.location.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cv">Upload Your CV</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        id="cv"
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        {...register("cv")}
                      />
                      <label
                        htmlFor="cv"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <FileTextIcon className="h-10 w-10 text-gray-400" />
                        <span className="text-sm font-medium">
                          Drag & drop files or{" "}
                          <span className="text-primary">Browse</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          Supported formats: Pdf
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                <Button className="w-full" type="submit">
                  Apply Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
