---
title: How I wrote and self-published my ebook!
description: This post goes into the specifics of publishing ebooks
date: 2020-10-04
layout: layouts/post.njk
---

I recently wrote my first e-book [Building JavaScript A+ Promises in 10 steps](https://www.amazon.in/Building-JavaScript-Promises-steps-know-ebook/dp/B08H8TXPYG/ref=sr_1_2?dchild=1&keywords=js+promises&qid=1601798406&s=digital-text&sr=1-2) and self-published it on both [Gumroad](https://gumroad.com/l/aplus) and [Amazon](https://www.amazon.in/Building-JavaScript-Promises-steps-know-ebook/dp/B08H8TXPYG/ref=sr_1_2?dchild=1&keywords=js+promises&qid=1601798406&s=digital-text&sr=1-2).

If you asked me a month back that would I ever write a book?, I would have answered with a resounding **NO**. As I thought writing and publishing a book would be so much work and you'd need editors/reviewers and publishing houses to back it!

`JavaScript Promises` have always been a fun topic for me and I'd always try and experiment with its gotchas and different ways you can use it to accomplish my use-cases. I also found out that though most people are comfortable in using it well but when it comes to understanding how it's working underneath it wasn't always clear.

I initially planned on writing a blog on how to create Promises from scratch and what's A+ spec about. I had a fair bit of understanding; how they work internally but when I actually started implementing it, it was truly a humbling process :)

I was unaware of so many edge-cases and then I started documenting the entire journey of fixing and building and repeat.

I also did a tiny bit of market research where I wanted to see if building these Promises from scratch was covered but I only found books talking about the usage/patterns and a handful of blogs which taught to create Promises but not from the point of view of A+ spec. I wanted to write an in-depth guide on how they are done with a clean and simplistic implementation that'll stick in the reader's mind for days to come.

> This is how the book came to be!

## How did I write?

I wrote the book using plain markdown in a single file. I used top-level headings to demarcate chapters as it made sense to me at the time.

It was super easy to use mark-down as I was used to writing a lot of it and there's very less syntax to know. Backticks for code snippets, `#` for headings and `-` for lists. That's all there's to it.

## How did I get the book ready for publishing?

I initially concentrated on finishing the manuscript and proof-reading it for flows and making sure I was covering all concepts in a clear and chronological way.

Once I was satisfied with the content I turned to my `google-fu` skills to see what all formats do I need to support. So there're three primary formats that you should take care of:

- pdf
- epub
- mobi (for Kindles)

I used `pandoc` to create the books from markdown with a little bit of customization.

### pdf

Using plain `pandoc` wasn't giving me what I wanted. So I used the amazing [Eisvogel template](https://github.com/Wandmalfarbe/pandoc-latex-template) to get a nice looking pdf book.

> Please read the setup instructions which are written in detail in the above Github link.

To make it work, I needed to add a bit of metadata at the top of my source manuscript markdown file. Note the triple dots at the end, they are intended.

```yaml
---
titlepage: true
titlepage-rule-height: 0
titlepage-background: "cover.png"
toc-own-page: true
listings-disable-line-numbers: true
...
```

This created `table-of-contents` into a separate page and added a cover pic which I self-designed on [Canva](https://www.canva.com)

There was one more issue; since my entire manuscript was just in one big markdown file and the individual chapters were demarcated by a top-level heading. Pandoc was generating the `pdf` file where the chapters didn't start from a new page, they seemed to be rendered in continuous with the previous content.

To fix this I had to add this line before each top level heading `\newpage`

Top-level heading means the following

```
\newpage
# This is a top level heading
```

The command to generate the final `pdf`

```bash
pandoc index.md -o "Building A+ Promises.pdf" --from markdown --template eisvogel --listings --pdf-engine=/Library/TeX/texbin/pdflatex --toc --toc-depth 2 -N
```

### epub

This is needed for ebook readers, I used my Mac's `Books.app` to test.

The procedure is almost same but a different way of configuration. The `metadata` is removed from the top of the file and added separately in a `yaml` file. I also removed the `\newpage` tags as it was only for the pdf template.

The command to build epub file that I used

```bash
pandoc index.md -o "Building A+ Promises.epub" --from gfm --listings  --toc --toc-depth 2 -N  --metadata-file metadata.txt --css syles.css --epub-cover-image=cover.png

```

You can pass a stylesheet to this to style some components. I used the following css file

```css
code {
  font-family: monospace;
  background-color: rgb(247, 247, 247);
}

pre {
  font-family: monospace;
  padding: 16px;
  font-size: 80%;
  border-radius: 3px;
  background-color: rgb(247, 247, 247);
}
```

I only wanted to add a slight highlight to the code snippets which the plain `pandoc` was not adding.

The `metadata.txt` looked like this

```yaml
title:
- type: main
  text: Building JavaScript A+ Promises in 10 steps!
creator:
- role: author
  text: Ankeet Maini
identifier:
date: 2020-08-29
```

### mobi

This was the easiest to do. I logged into Amazon's Kindle Self Publishing portal. I uploaded the above generated `epub` and it converted it to a compatible `mobi` file.

That's all for this one, if you've read my book reviews would be amazing :)

Please post it on Amazon listing or send me direct feedback and I'll be happy to hear.

Thanks!
