import charityCommunityImage from "../assets/charity-community.jpg";
import charityForestImage from "../assets/charity-forest.jpg";
import charityGolfImage from "../assets/charity-golf.jpg";

const supportedThemes = new Set(["green", "gold", "blue"]);

export const charityImages = {
    green: charityForestImage,
    gold: charityGolfImage,
    blue: charityCommunityImage
};

export const getCharityThemeClass = (theme) => {
    const normalizedTheme = String(theme || "").toLowerCase();

    if (supportedThemes.has(normalizedTheme)) {
        return `charity-theme-${normalizedTheme}`;
    }

    return "charity-theme-green";
};

export const getCharityImageStyle = (theme) => {
    const image = charityImages[String(theme || "").toLowerCase()] || charityImages.green;

    return {
        backgroundImage: `url(${image})`
    };
};
