import Cookie from "js-cookie";
const getCookie = (name) => {
  return Cookie.get(name);
};

export default getCookie;
