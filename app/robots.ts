import { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/"],
                disallow: ["/admin", "/api/", "/dashboard"]
            },
        ],
        sitemap: "https://www.codeaai.org/sitemap.xml"
    }
}