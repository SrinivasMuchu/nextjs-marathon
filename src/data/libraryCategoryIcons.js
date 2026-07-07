import { slugify } from '@/common.helper';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import FlightOutlinedIcon from '@mui/icons-material/FlightOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SailingOutlinedIcon from '@mui/icons-material/SailingOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FactoryOutlinedIcon from '@mui/icons-material/FactoryOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';

const CATEGORY_ICON_MAP = {
  all: AppsOutlinedIcon,
  '3d-printing': PrintOutlinedIcon,
  aerospace: RocketLaunchOutlinedIcon,
  'aerospace-and-aviation': RocketLaunchOutlinedIcon,
  'aerospace-and-defence': RocketLaunchOutlinedIcon,
  architecture: AccountBalanceOutlinedIcon,
  automotive: DirectionsCarOutlinedIcon,
  aviation: FlightOutlinedIcon,
  chemical: ScienceOutlinedIcon,
  construction: ConstructionOutlinedIcon,
  electrical: BoltOutlinedIcon,
  'energy-and-power': LightbulbOutlinedIcon,
  robotics: PrecisionManufacturingOutlinedIcon,
  'industrial-design': DesignServicesOutlinedIcon,
  medical: MedicalServicesOutlinedIcon,
  marine: SailingOutlinedIcon,
  manufacturing: FactoryOutlinedIcon,
  agriculture: AgricultureOutlinedIcon,
  biotech: BiotechOutlinedIcon,
  'machine-design': HandymanOutlinedIcon,
};

export function getLibraryCategoryIcon(categoryName, { isAll = false } = {}) {
  if (isAll) return AppsOutlinedIcon;

  const slug = slugify(categoryName || '');
  return CATEGORY_ICON_MAP[slug] || CategoryOutlinedIcon;
}
