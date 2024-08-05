import Pkg from "../../package.json";

export const getAppName = () => {
	return Pkg.name;
};
export const getAppVersion = () => {
	return Pkg.version;
};
