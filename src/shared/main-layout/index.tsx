import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isMobile, isTablet, isAndroid } from "react-device-detect";

import { useConfig as useConfigStores } from "@/store/config";
import { Dialog, DialogContent } from "../components/ui/dialog";
import ConfirmationModal from "../components/confirmation-modal";

import Header from "./header";
import Footer from "./footer";
import ScrollToTopButton from "./scroll-to-top";
import ChatBot from "@/features/Home/chat-bot";
import TagManager from "react-gtm-module";

const MainLayout: React.FC<{ children: React.ReactNode; configData: any }> = ({
  children,
  configData,
}) => {
  const router = useRouter();
  const { setConfigData } = useConfigStores();
  const googleTagManagerId = configData?.data?.pageData?.googleTagManager;
  const [showMobileModal, setShowMobileModal] = useState<boolean>(false);

  const appRedirect = () => {
    if (isAndroid) {
      const redirectUrl =
        configData?.data?.pageData["section4 googleplay link"];
      router.push(redirectUrl);
    } else {
      const redirectUrl = configData?.data?.pageData["section4 appstore link"];
      router.push(redirectUrl);
    }
  };
  const cancelModal = () => {
    setShowMobileModal(false);
  };

  useEffect(() => {
    if (isMobile || isTablet) {
      setShowMobileModal(true);
    }
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (configData) {
      setConfigData(configData);
    }
  }, [configData]);

  useEffect(() => {
    if (typeof googleTagManagerId !== "undefined") {
      TagManager.initialize({ gtmId: googleTagManagerId });
    }
  }, [googleTagManagerId]);

  return (
    <>
      <Head>
        <title>Farmshop</title>
        <meta
          name="description"
          content={configData ? configData?.meta?.socialTags.description : ""}
          key={configData ? configData?.meta?.socialTags.keywords : ""}
        />
        <meta
          property="og:title"
          content={configData && configData?.meta?.socialTags["og:title"]}
        />
        <meta
          property="og:description"
          content={configData && configData?.meta?.socialTags["og:description"]}
        />
        <meta
          property="og:image"
          content={configData && configData?.meta?.socialTags["og:image"]}
        />
        <meta
          property="twitter:title"
          content={configData && configData?.meta?.socialTags["twitter:title"]}
        />
        <meta
          property="twitter:description"
          content={
            configData && configData?.meta?.socialTags["twitter:description"]
          }
        />
        <meta
          property="twitter:image"
          content={configData && configData?.meta?.socialTags["twitter:image"]}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagManagerId}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleTagManagerId}');
            `,
          }}
        />
        {/* <GoogleTagManager googleTagManagerId={googleTagManagerId}/> */}
      </Head>
      <>
        <Header />
        {children}
        <Footer />
        <ScrollToTopButton />
        <ChatBot />

        {/* Detecting if opened in mobile or not */}
        {showMobileModal && (
          <Dialog open={showMobileModal} onOpenChange={cancelModal}>
            <DialogContent>
              <ConfirmationModal
                confirmHeading="If you are on mobile, you will get much better experience using our mobile app."
                modalType="mobile-detect"
                btnName="Yes"
                showModal={showMobileModal}
                btnFunction={appRedirect}
                cancelFuntion={cancelModal}
                isLoading={false}
              >
                <p className="text-sm">Please Download The Farmshop App.</p>
              </ConfirmationModal>
            </DialogContent>
          </Dialog>
        )}

        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
      </>
    </>
  );
};

export default MainLayout;
