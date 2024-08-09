const MAX_UID = Number(10000000000000000000n);
const NANO_DIFF = 1000000;
function genYandexUID() {
    return BigInt(Math.floor(Math.random() * MAX_UID)).toString();
}
function genYandexMetrikaUID() {
    return Math.floor(Date.now() * NANO_DIFF).toString();
}
export { genYandexUID, genYandexMetrikaUID };
