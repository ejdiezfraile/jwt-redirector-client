<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { showAlert, showError } from "./utils";
import { getJWTAPI, executeRedirectAPI } from "./api";
import type { Usuario as ApiUsuario } from "./api"; // Renamed to avoid conflict if Usuario is defined locally
import {
  perfiles,
  roles,
  idAplicaciones,
  modulos,
  secrets,
} from "./formData";

const usuario = reactive({
  sub: "admin",
  iss: "https://auth.telefonica.es",
  exp: 1917509365000,
  app: "HDMP",
  roles: ["admin-Administrador"],
});

const host = ref(window.location.hostname);
const port = ref("9800");
const module = ref("pizarra HTML5");
const secret = ref("");
const jwt = ref("");

const isPizarra = computed(() => {
  return module.value === "pizarra Flash" || module.value === "pizarra HTML5";
});

const selectedModule = computed(() => {
  for (let i = 0; i < modulos.length; i++) {
    if (modulos[i].name == module.value) {
      return modulos[i];
    }
  }
  return {};
});

const target = computed(() => {
  const params = isPizarra.value ? jwt.value : "";
  const portValue = port.value ? ":" + port.value : "";
  return (
    window.location.protocol +
    "//" +
    host.value +
    portValue +
    "/" +
    selectedModule.value.path +
    params
  );
});

const fallback = computed(() => {
  const portValue = port.value ? ":" + port.value : "";
  return (
    window.location.protocol +
    "//" +
    host.value +
    portValue +
    "/" +
    selectedModule.value.fallback
  );
});

const clearJWT = () => (jwt.value = "");

const validateGetJWT = () => {
  if (usuario.sub === "") {
    showAlert("Falta el nombre de usuario");
  } else if (usuario.app === "") {
    showAlert("Falta la aplicación LDAP");
  } else if (usuario.roles.length === 0) {
    showAlert("Es necesario selecionar un perfil o un grupo");
  } else {
    // todo OK
    return true;
  }
  // Algo falta
  return false;
}

const validateRedirectJWT = () => {
  if (host.value === "") {
    showAlert("Falta el nombre de host");
  } else if (module.value === "") {
    showAlert("Falta seleccionar una aplicacion");
  } else {
    // todo OK
    return true;
  }

  // Algo falta
  return false;
}

onMounted(() => {
  console.log('onMounted');
  secret.value = secrets[0]
});

</script>

<template>
  <form @submit.prevent="" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <!-- Usuario / Aplicación LDAP-->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="usuario">
          Usuario
        </label>
        <input type="text"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
          id="usuario" v-model="usuario.sub" @change="clearJWT" />
      </div>

      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="aplicacion">
          Aplicaci&oacute;n LDAP
        </label>
        <div class="relative">
          <select
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="aplicacion" v-model="usuario.app" @change="clearJWT">
            <option v-for="item in idAplicaciones" :value="item">
              {{ item }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Perfiles-Subperfiles / Grupos-Roles-->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="perfiles">
          Perfiles / Subperfiles
        </label>
        <select multiple
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="perfiles" v-model="usuario.roles" @change="clearJWT">
          <option v-for="item in perfiles" :value="item">{{ item }}</option>
        </select>
      </div>

      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="roles">
          Roles / Grupos
        </label>
        <select multiple
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="roles" v-model="usuario.roles" @change="clearJWT">
          <option v-for="item in roles" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>
    <!-- secret -->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full px-3">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="secret">
          Secret
        </label>
        <select
          class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="secrets" v-model="secret" @change="clearJWT">
          <option v-for="item in secrets" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>

    <!-- JWT -->
    <div class="flex flex-wrap -mx-3 mb-6">
      <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          @click="async () => { const newJwt = await getJWTAPI(usuario, secret.value, validateGetJWT); if (newJwt) { jwt.value = newJwt; } }">
          Calcular JWT
        </button>
      </div>
      <div class="w-full md:w-3/4 px-3 mb-6 md:mb-0">
        <input type="text"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="jwt" v-model="jwt" />
      </div>
    </div>

    <!-- host / puerto / modulo-->
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="host">
          Host
        </label>
        <input type="text"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="host" v-model="host" />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="port">
          Puerto
        </label>
        <input type="text"
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="port" v-model="port" />
      </div>
      <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="module">
          Aplicaci&oacute;n
        </label>
        <div class="relative">
          <select
            class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            id="module" v-model="module">
            <option v-for="item in modulos" :value="item.name">
              {{ item.name }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Redirector -->
    <div class="flex flex-wrap -mx-3 mb-2">
      <div class="w-full md:w-3/4 px-3 mb-6 md:mb-0">
        <span
          class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight">
          {{ target }}</span>
      </div>
      <div class="w-full md:w-1/4 px-3 mb-6 md:mb-0">
        <button
          class="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          @click="async () => {
            if (!validateRedirectJWT()) {
              console.log('Validation for redirect failed.');
              return;
            }

            let currentJwt = jwt.value;

            if (currentJwt === '') {
              console.log('JWT is empty, attempting to fetch...');
              if (!validateGetJWT()) {
                console.log('Validation for GetJWT failed.');
                return;
              }
              const newJwt = await getJWTAPI(usuario, secret.value, validateGetJWT);
              if (newJwt) {
                jwt.value = newJwt;
                currentJwt = newJwt;
                console.log('JWT fetched successfully.');
              } else {
                console.log('Failed to fetch JWT. Redirect aborted.');
                return;
              }
            }

            if (currentJwt && currentJwt !== '') {
              console.log('Proceeding to redirect with JWT:', currentJwt);
              await executeRedirectAPI(isPizarra.value, target.value, currentJwt, fallback.value);
            } else {
              console.log('No JWT available. Redirect aborted.');
              showAlert('No se pudo obtener un JWT para la redirección.');
            }
          }">
          Enviar JWT
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
</style>
