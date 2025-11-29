export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
// export const DEFAULT_PHOTO = "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/profilelogodefault.png"
export const PHOTO_LINK = "https://marathon-org-assets.s3.ap-south-1.amazonaws.com/"
// export const DEFAULT_COMPANY_LINK = "https://member-images.s3.ap-south-1.amazonaws.com/upload_1695283928.png"
export const MARATHON_ASSET_PREFIX_URL = "https://d2o2bcehk92sin.cloudfront.net/";
export const ASSET_PREFIX_URL = "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/";
export const TITLELIMIT = 100;
export const DESCRIPTIONLIMIT = 500;
// export const HEADERS = { "x-auth-token": localStorage.getItem('token')}
export const allowedFilesList = [".step", ".stp", ".stl", ".ply", ".off", ".igs", ".iges", ".brp", ".brep",".obj"];
export const BUCKET = 'marathon-org-assets';
export const DESIGN_GLB_PREFIX_URL = 'https://d1d8a3050v4fu6.cloudfront.net/';
export const IMAGEURLS = {
  logo: `${MARATHON_ASSET_PREFIX_URL}marathon-demo-logo.svg`,
  hardwareLogo: `${MARATHON_ASSET_PREFIX_URL}hardware_logo.webp`,
  menu: `${MARATHON_ASSET_PREFIX_URL}menu-icon.webp`,
  easyToUse: `${MARATHON_ASSET_PREFIX_URL}easy-to-use.webp`,
  teamwork: `${MARATHON_ASSET_PREFIX_URL}teamwork.webp`,
  automation: `${MARATHON_ASSET_PREFIX_URL}automated.webp`,
  orgHierarchy: `${MARATHON_ASSET_PREFIX_URL}org-hierarchy.webp`,
  openAnswer: `${MARATHON_ASSET_PREFIX_URL}open-answer.webp`,
  points: `${MARATHON_ASSET_PREFIX_URL}points.webp`,
  feature: `${MARATHON_ASSET_PREFIX_URL}feature.webp`,
  allInOne: `${MARATHON_ASSET_PREFIX_URL}all-in-one.svg`,
  carManufac: `${MARATHON_ASSET_PREFIX_URL}car-manufacturing.svg`,
  cloud: `${MARATHON_ASSET_PREFIX_URL}cloud.svg`,
  customised: `${MARATHON_ASSET_PREFIX_URL}customised.svg`,
  demoVideo: `${MARATHON_ASSET_PREFIX_URL}marathon-demo-video.mp4`,
  check: `${MARATHON_ASSET_PREFIX_URL}check.svg`,
  unCheck: `${MARATHON_ASSET_PREFIX_URL}cross-check.svg`,
  cadCapability: `${MARATHON_ASSET_PREFIX_URL}capability-cad.svg`,
  footerLogo: `${MARATHON_ASSET_PREFIX_URL}contact-logo.svg`,
  orgChart: `${MARATHON_ASSET_PREFIX_URL}hierarchy-img_resized.png`,
  safetyIcon: `${MARATHON_ASSET_PREFIX_URL}safety-icon.svg`,
  autoDelete: `${MARATHON_ASSET_PREFIX_URL}auto-delete.svg`,
  importExport: `${MARATHON_ASSET_PREFIX_URL}import-export.svg`,
  uploadLimit: `${MARATHON_ASSET_PREFIX_URL}upload-size.svg`,
  // craneLogo: `${MARATHON_ASSET_PREFIX_URL}crane.webp`,
  bmwLogo: `${MARATHON_ASSET_PREFIX_URL}bmw.webp`,
  bmwParts: `${MARATHON_ASSET_PREFIX_URL}bmwparts.jpg`,
  bmwNumber: `${MARATHON_ASSET_PREFIX_URL}bmw-part-number.webp`,
  partsBlog: `${MARATHON_ASSET_PREFIX_URL}part_blog_img_compressed.webp`,
  carLogo: `${MARATHON_ASSET_PREFIX_URL}workflow_car.webp`,
  latopLogo: `${MARATHON_ASSET_PREFIX_URL}wokflow_laptop.webp`,
  droneLogo: `${MARATHON_ASSET_PREFIX_URL}workflow_drone.webp`,
  robotLogo: `${MARATHON_ASSET_PREFIX_URL}workflow_robo.webp`,
  craneLogo: `${MARATHON_ASSET_PREFIX_URL}workflow_crane.webp`,
  closeIcon: `${MARATHON_ASSET_PREFIX_URL}close-icon-part-num.png`,
  uploadIcon: `${MARATHON_ASSET_PREFIX_URL}upload-icon.svg`,
  solutionCad: `${MARATHON_ASSET_PREFIX_URL}solution-cad.webp`,
  rightArrow: `${MARATHON_ASSET_PREFIX_URL}designs-right-arrow.svg`,
  leftArrow: `${MARATHON_ASSET_PREFIX_URL}designs-left-arrow.svg`,
  orgImg: `${MARATHON_ASSET_PREFIX_URL}org_img.webp`,
  cadViewer: `${MARATHON_ASSET_PREFIX_URL}cad_viewer.webp`,
  cadConveter: `${MARATHON_ASSET_PREFIX_URL}cad_converter.webp`,
  ourStory:`${MARATHON_ASSET_PREFIX_URL}new_our-story-img.webp`,
  uday:`${MARATHON_ASSET_PREFIX_URL}uday_khatry.jpg`,
  suyog:`${MARATHON_ASSET_PREFIX_URL}suyog_patel.jpg`,
  apoorv:`${MARATHON_ASSET_PREFIX_URL}apoorv_garg.jpg`,
  yugal:`${MARATHON_ASSET_PREFIX_URL}yugal_raj_jain.jpg`,
  karishma:`${MARATHON_ASSET_PREFIX_URL}karishma.jpg`,
  srinivas:`${MARATHON_ASSET_PREFIX_URL}srinivas.jpg`,
  googleLogo:`${MARATHON_ASSET_PREFIX_URL}google_logo.svg`,
  marathonLogo:`${MARATHON_ASSET_PREFIX_URL}m-logo.svg`,
  creatorBg:`${MARATHON_ASSET_PREFIX_URL}creator-bg.webp`,
  uploadCover:`${MARATHON_ASSET_PREFIX_URL}ImageSquare.svg`,
  nofilesLogo:`${MARATHON_ASSET_PREFIX_URL}nofiles_img.webp`
  // ImageSquare.svg
  // open-answer.webp
  // Add more images as needed
};



export const TICKET_ATTACHMENT_BUCKET = 'member-images'
// export const GOOGLE_CLIENT_ID = '489950323098-a8i5stost392oousg6k1t3u4tbupi8tq.apps.googleusercontent.com'
export const MICROSOFT_CLIENT_ID = "8ef57ff0-a2bf-423d-8400-fe3fdf571177"


// event categories gatag
export const CAD_VIEWER_EVENT = 'CAD_VIEWER'
export const CAD_CONVERTER_EVENT = 'CONVERTER'
export const CAD_BROWSER_NOTIFICATION_EVENT = 'BROWSER_NOTIFICATION'
export const CAD_PUBLISH_EVENT = 'PUBLISH'
export const CAD_FLOATING_BUTTON_EVENT = 'FLOATING_BUTTON'
export const CAD_RATING_EVENT = 'CAD_RATING'
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
export const GOOGLE_ADSENSE_CLIENT_ID = process.env.NEXT_GOOGLE_ADS_CLIENT_ID
export const RAZORPAY_SECRET = process.env.NEXT_PUBLIC_RAZORPAY_SECRET_ID
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

export const MARATHONDETAILS = {
  name: "Marathon Technologies",
  description: "A platform for CAD file management and collaboration.",
  theme: "#610bee",
  image: "https://marathon-web-assets.s3.ap-south-1.amazonaws.com/logo-1.png"
};