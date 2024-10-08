import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import MainLayout from "@/shared/main-layout";
// import { NextPageWithLayout } from "../../../../pages/_app";
// import { config } from "../../../../config";
import axios from "axios";
import JobApplication from "@/features/job-form";
import { config } from "../../../../../../config";
import { NextPageWithLayout } from "@/pages/_app";

// Define the Zod schema
// const validationSchema = z.object({
//   fullName: z.string().min(1, "Full Name is required"),
//   contactNumber: z.string().min(1, "Contact Number is required"),
//   emailAddress: z.string().email("Invalid email address"),
//   location: z.string().min(1, "Location is required"),
//   cv: z.any(),
// });

// type SchemaProps = z.infer<typeof validationSchema>;

const CareerApplicationForm: NextPageWithLayout = () => {
  // const router = useRouter();
  // const { slug } = router.query;
  // const { configData } = useConfigStores();
  // const { executeRecaptcha } = useGoogleReCaptcha();

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<SchemaProps>({
  //   resolver: zodResolver(validationSchema),
  // });

  // const CreateMutation = useMutation({
  //   mutationFn: (data) => {
  //     // Replace with actual submit function
  //     return Promise.resolve(data);
  //   },
  //   onSuccess: (data) => {
  //     // Handle successful submission
  //     console.log("Application submitted:", data);
  //   },
  //   onError: (error: any) => {
  //     console.log("error:", error);
  //   },
  // });

  // const onSubmit = async (data: any) => {
  //   // Add file validation logic here
  //   const fileInput = document.getElementById("cv") as HTMLInputElement;
  //   if (fileInput?.files?.length) {
  //     const file = fileInput.files[0];
  //     if (file.type !== "application/pdf") {
  //       console.log("Invalid file type. Only PDF is allowed.");
  //       return;
  //     }
  //   }

  //   if (!executeRecaptcha) {
  //     console.log("Execute recaptcha not yet available");
  //     return;
  //   }

  //   const token = await executeRecaptcha("submit");
  //   if (token) {
  //     // Add the token to the data
  //     data.recaptchaToken = token;
  //     CreateMutation.mutate(data);
  //   }
  // };

  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LfYLD4qAAAAAD7u_LUpYr71TpZXiyticjCnpuHK">
      {/* <div className="bg-white pb-14 -mb-14">
        <Head>
          <title>Apply for Job</title>
        </Head>
        <div className="text-lg my-10">
          <div className="container">
            <Card className="w-full mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl ">Apply for {slug}</CardTitle>
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
                        id="contactNumber"
                        placeholder="Contact Number"
                        {...register("contactNumber")}
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
                  <Button className="w-full" type="submit">
                    Apply Now
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div> */}
      <JobApplication />
    </GoogleReCaptchaProvider>
  );
};

export default CareerApplicationForm;

CareerApplicationForm.getLayout = (page) => {
  const configData = page?.props;
  return <MainLayout configData={configData}>{page}</MainLayout>;
};

export async function getServerSideProps() {
  const baseUrl = config?.gateway?.apiURL;
  const endPoint1 = config?.gateway?.apiEndPoint1;
  const apiUrl = `${baseUrl}/${endPoint1}/configs`;
  const response: any = await axios.get(apiUrl, {
    headers: {
      Accept: "application/json",
      "Api-Key": config.gateway.apiKey,
    },
  });

  return {
    props: response?.data,
  };
}
