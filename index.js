//Blob: Binary large object
const d = document;
const $downloadBtn = d.getElementById("btn-download");
const $input = d.getElementById("url");

console.log($downloadBtn);

d.addEventListener("click", async (e) => {
    if (e.target == $downloadBtn) {
        e.preventDefault();
        $downloadBtn.setAttribute("disabled", true);
        $downloadBtn.classList.add("disabled");
        $downloadBtn.style.cursor = "wait";

        fetchFile($input.value);
    }
});

//Function that executes the response and download the file
async function fetchFile(url) {
    const request = await fetch("http://localhost:3000/url", {
        method: "POST",
        body: JSON.stringify({
            url,
            name: "olaa",
        }),
        headers: new Headers({
            "Content-type": "application/json; charset=UTF-8",
        }),
    });

    const responseBlob = await request.blob(); //Then we use blob method to return a blob
    console.log(responseBlob); //this object store the size and the type of the file that was requested
    const tempUrl = URL.createObjectURL(responseBlob); //createObject creates a string with the value of the url from the blob oject
    const $link = d.createElement("a"); //it creates a link
    $link.href = tempUrl; //the href will be the object url
    $link.download = ""; //and will have the attribute download

    d.body.appendChild($link); //the body inserts the a tag
    $link.click();
    $link.remove(); //finally the a tag it's remove from the dom
    $downloadBtn.removeAttribute("disabled");
    $downloadBtn.classList.remove("disabled");
    $downloadBtn.style.cursor = "";
}
