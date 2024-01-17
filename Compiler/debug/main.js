export const assert = (b, s = "Internal Error") => {
    if (!b) throw new Error(s);
}

export const invalid_path = (s = "Internal Error") => {
    throw new Error(s);
}