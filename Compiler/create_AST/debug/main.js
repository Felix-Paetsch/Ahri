export const assert = (b, s = "Internal Error") => {
    if (!b) throw new Error(s);
}