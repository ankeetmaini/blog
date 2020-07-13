const style = document.createElement("style")

style.innerHTML = `
html {
	line-height: 1.6;
}
p {
	margin-bottom: 1.75rem;
}
`
const head = document.head
if (head.firstChild) {
  head.insertBefore(style, head.firstChild)
} else {
  head.appendChild(style)
}
