export default class HTMLDecodeHelper {
    public static decodeHTML (html: string) {
        let txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }
}