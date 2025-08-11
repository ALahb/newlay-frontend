import React from "react";
import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import { Link, useLocation, matchPath } from "react-router-dom";

export default function BreadcrumbsNav() {
  const location = useLocation();

  const breadcrumbNameMap = {
    "/newlay": "Clinic Requests",
    "/newlay/clinicrequests/add": "Create Request",
    "/newlay/clinicrequests/edit": "Edit Request",
    "/newlay/clinicrequests/display": "View Request",
    "/newlay/clinicrequests/payment": "Payment",
  };

  function getBreadcrumbs(pathname) {
    const breadcrumbs = [
      {
        to: "/newlay",
        label: breadcrumbNameMap["/newlay"],
      },
    ];

    if (matchPath("/newlay/clinicrequests/add", pathname)) {
      breadcrumbs.push({
        to: "/newlay/clinicrequests/add",
        label: breadcrumbNameMap["/newlay/clinicrequests/add"],
      });
    } else if (matchPath("/newlay/clinicrequests/edit/:id", pathname)) {
      breadcrumbs.push({
        to: pathname,
        label: breadcrumbNameMap["/newlay/clinicrequests/edit"],
      });
    } else if (matchPath("/newlay/clinicrequests/display/:id", pathname)) {
      breadcrumbs.push({
        to: pathname,
        label: breadcrumbNameMap["/newlay/clinicrequests/display"],
      });
    } else if (matchPath("/newlay/clinicrequests/payment/:id", pathname)) {
      breadcrumbs.push({
        to: pathname,
        label: breadcrumbNameMap["/newlay/clinicrequests/payment"],
      });
    }

    return breadcrumbs;
  }

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
      {breadcrumbs.map((crumb, idx) => {
        const isLast = idx === breadcrumbs.length - 1;
        return isLast ? (
          <Typography color="text.primary" key={crumb.to}>
            {crumb.label}
          </Typography>
        ) : (
          <MuiLink
            component={Link}
            underline="hover"
            color="inherit"
            to={crumb.to}
            key={crumb.to}
          >
            {crumb.label}
          </MuiLink>
        );
      })}
    </Breadcrumbs>
  );
}
