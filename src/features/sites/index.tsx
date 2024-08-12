import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetOrgSitesPagesQuery } from "@/app/api/v0/public";
import { toast } from "@/hooks/shadcn-ui";
import { Button, Typography } from "@/components/ui";
import { Link } from "react-router-dom";

export const Sites = () => {
  // TODO: have huge issues
  //! Caching problem if sites is cached the new data not showing
  const params = useParams();
  const location = useLocation();

  const { data, isLoading, error } = useGetOrgSitesPagesQuery(
    params.orgIdOrUsername
  );

  const [content, setContent] = useState(null);

  useEffect(() => {
    if (data?.data?.items[0]) {
      setContent(JSON.parse(data?.data?.items[0]?.content));
    }
    if (error?.data?.status) {
      toast({
        variant: "destructive",
        title: error?.data?.message,
      });
    }
  }, [data?.data?.items, error?.data?.message, error?.data?.status]);

  useEffect(() => {
    if (content?.css) {
      const style = document.createElement("style");
      style.type = "text/css";
      style.innerHTML = content.css;

      document.head.appendChild(style);
    }
  }, [content?.css]);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {content && (
        <div dangerouslySetInnerHTML={{ __html: content?.html }}></div>
      )}
      {!content && !isLoading && (
        <div className="h-screen flex items-center justify-center gap-4 flex-col">
          <Typography variant="h1" className="text-red-500">
            Sites is not available.
          </Typography>
          <Link to={location.state?.from?.pathname || "/"}>
            <Button>go back</Button>
          </Link>
        </div>
      )}
    </>
  );
};