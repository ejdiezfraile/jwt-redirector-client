interface Modulo {
  name: string;
  path: string;
  fallback: string;
}

export const perfiles: string[] = [
  "ATMOVIL-ATMOVIL1",
  "CAT-CAT1",
  "CATMV-CATMV1",
  "CATMV2-CATMV2",
  "CGP-CGP1",
  "CT-CSE",
  "CT-CT1",
  "CT-CTBIL",
  "CT-CTLEON",
  "CT-CTNETLAN",
  "CT-CTR",
  "CT-CTSEV",
  "CT-CTSIP",
  "CT-CTVAL",
  "CT-CTVALL",
  "CT-NGN",
  "FLEXIBILIZACION-CTSev",
  "FOA-FOA1",
  "INCGEST-INCGEST1",
  "INSTA-INSTA1",
  "PRIMERA_LINEA-PRIMERA_LINEA1",
  "PUBLICADOR-ATMOVIL1",
  "SDR-SDR1",
  "SOR-SAyA",
  "SOR-SGEN",
];
export const roles: string[] = [
  "admin-Administrador",
  "ADM.HADAX-Administrador",
  "SDR-Administrador",
  "TELCO-Administrador",
  "TELCO-EDITOR",
  "TELCO_INTERNO-Administrador",
  "test1-Administrador",
  "test2-EDITOR",
];

export const idAplicaciones: string[] = ["HDM", "HDM1", "HDMP", "HDMPA"];

export const modulos: Modulo[] = [
  {
    name: "hdm-user",
    path: "hdm_user/home",
    fallback: "hdm_user/jsp/inicioJWT.jsp",
  },
  {
    name: "hdm-manager",
    path: "hdm_manager/home",
    fallback: "hdm_manager/jsp/inicioJWT.jsp",
  },
  {
    name: "hdm-net",
    path: "hdm_net/home",
    fallback: "hdm_net/jsp/inicioJWT.jsp",
  },
  {
    name: "hdm-deploy",
    path: "hdm_hdxdep/home",
    fallback: "hdm_hdxdep/jsp/inicioJWT.jsp",
  },
  { name: "pizarra HTML5", path: "pizHTML5?agua=", fallback: "" },
  {
    name: "myhdm",
    path: "myhdm/home?debug=true",
    fallback: "myhdm/index.html?debug=true",
  },
  {
    name: "hdm-user-local",
    path: "hidra/home",
    fallback: "hidra/jsp/loginJWT.jsp",
  },
];

export const secrets: string[] = ["c+Gele7=", "vX7VUCc="];
