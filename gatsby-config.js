module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-61474244-4",
        head: true,
      },
    },
    `gatsby-theme-blog`,
    `gatsby-theme-blog-darkmode`,
    `gatsby-plugin-offline`,
  ],
  // Customize your site metadata:
  siteMetadata: {
    title: `Under Engineered`,
    author: `Ankeet Maini`,
    description: `My journey with code and bugs`,
    social: [
      {
        name: `twitter`,
        url: `https://twitter.com/ankeetmaini`,
      },
      {
        name: `github`,
        url: `https://github.com/ankeetmaini`,
      },
      {
        name: `instagram`,
        url: `https://instagram.com/ankeetmaini`,
      },
      {
        name: `decks`,
        url: `/decks`,
      },
    ],
  },
}
