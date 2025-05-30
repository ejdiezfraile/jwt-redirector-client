Vue.createApp({
  data: function() {
    return {
      perfiles: [
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
    ],
    roles: [
      "admin-Administrador",
      "ADM.HADAX-Administrador",
      "SDR-Administrador",
      "TELCO-Administrador",
      "TELCO-EDITOR",
      "TELCO_INTERNO-Administrador",
      "test1-Administrador",
      "test2-EDITOR"
    ],
    idAplicaciones: ["HDM", "HDM1", "HDMP", "HDMPA"],
    modulos: [
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
    ],
    usuario: {
      sub: "admin",
      iss: "https://auth.telefonica.es",
      exp: 1917509365000,
      app: "HDMP",
      roles: ["admin-Administrador"],
    },
    host: window.location.hostname,
    port: 9800,
    module: "pizarra HTML5",
    secret: "",
    secrets: ["c+Gele7=", "vX7VUCc="],
    jwt: "",
    };
  },
  mounted: function() {
    this.secret = this.secrets[0]
  },
  methods: {
    clearJWT: function () {
      this.jwt = "";
    },
    showAlert: function (message) {
      console.warn("Alert:", message);
      alert("Aviso: " + message);
    },
    showError: function (error) {
      console.error("Error:", error);
      alert("Error: " + error);
    },
    validateGetJWT: function () {
      if (this.usuario.sub === "") {
        this.showAlert("Falta el nombre de usuario");
      } else if (this.usuario.app === "") {
        this.showAlert("Falta la aplicación LDAP");
      } else if (this.usuario.roles.length === 0) {
        this.showAlert("Es necesario selecionar un perfil o un grupo");
      } else {
        // todo OK
        return true;
      }
      // Algo falta
      return false;
    },
    fetchJWT: function () {
      console.log("fetchJWT!");
      return fetch("./jwt-token", {
        method: "POST",
        body: JSON.stringify({
          payload: this.usuario,
          secret: this.secret,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("An error has occured: " + response.status);
        }
        return response.json();
      });
    },
    getJWT: function () {
      console.log("getJWT!");
      console.log(JSON.stringify(this.usuario));
      if (!this.validateGetJWT()) return;

      var vm = this;
      return this.fetchJWT()
        .then(function (data) {
          if (data && data.jwt) {
            console.log(data);
            vm.jwt = data.jwt;
          }
        })
        .catch(function (error) {
          vm.showError(error.message);
        });
    },
    validateRedirectJWT: function () {
      if (this.host === "") {
        this.showAlert("Falta el nombre de host");
      } else if (this.module === "") {
        this.showAlert("Falta seleccionar una aplicacion");
      } else {
        // todo OK
        return true;
      }

      // Algo falta
      return false;
    },
    fetchRedirectJWT: function () {
      console.log("fetchRedirectJWT!");

      if (this.isPizarra) {
        window.open(this.target, "_blank").focus();
        return;
      }

      var vm = this;
      return (response = fetch(this.target, {
        credentials: "include",
        headers: {
          Authorization: "Bearer " + this.jwt,
        },
      }).then(function (response) {
        console.log("Success fetchRedirectJWT:", response);
        if (response.redirected) {
          // window.location.href = response.url;
          window.open(response.url, "_blank");
        } else if (response.ok) {
          //  IE10. Intentar adivinar
          // window.location.href = vm.fallback;
          window.open(vm.fallback, "_blank");
        } else {
          throw new Error(
            "Problemas con " +
              response.url +
              " " +
              response.statusText +
              "(" +
              response.status +
              ")"
          );
        }
      }));
    },
    redirectJWT: function () {
      console.log("redirectJWT!");
      if (!this.validateRedirectJWT()) return;

      var vm = this;
      // Pedimos el jwt
      if (this.jwt === "") {
        if (!this.validateGetJWT()) return;

        this.getJWT()
          .then(function () {
            return vm.fetchRedirectJWT();
          })
          .catch(function (error) {
            vm.showError(error);
          });
      } else {
        this.fetchRedirectJWT().catch(function (error) {
          vm.showError(error);
        });
      }
    },
  },
  computed: {
    isPizarra: function () {
      return this.module === "pizarra Flash" || this.module === "pizarra HTML5";
    },
    selectedModule: function () {
      for (var i = 0; i < this.modulos.length; i++) {
        if (this.modulos[i].name == this.module) {
          return this.modulos[i];
        }
      }
      return {};
    },
    target: function () {
      const params = this.isPizarra ? this.jwt : "";
      const port = this.port ? ":" + this.port : "";
      return (
        window.location.protocol +
        "//" +
        this.host +
        port +
        "/" +
        this.selectedModule.path +
        params
      );
    },
    fallback: function () {
      const port = this.port ? ":" + this.port : "";
      return (
        window.location.protocol +
        "//" +
        this.host +
        port +
        "/" +
        this.selectedModule.fallback
      );
    },
  },
}).mount('#app');