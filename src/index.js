import fontkit from './base';
import TTFFont from './TTFFont';
import WOFFFont from './WOFFFont';
import TrueTypeCollection from './TrueTypeCollection';
import DFont from './DFont';

// Register font formats
fontkit.registerFormat(TTFFont);
fontkit.registerFormat(WOFFFont);
fontkit.registerFormat(TrueTypeCollection);
fontkit.registerFormat(DFont);

export default fontkit;
