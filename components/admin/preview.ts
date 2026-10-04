
import { WeddingConfig } from '../../types';
import { Lang } from '../../i18n/config';

// Messages between the admin panel and its live preview frame (the app at #preview)
export const PREVIEW_MESSAGE = 'e-wed:preview';
export const PREVIEW_READY = 'e-wed:preview-ready';

export interface PreviewMessage {
  type: typeof PREVIEW_MESSAGE;
  config: WeddingConfig;
  /** Section id to scroll to, sent when the admin switches tab */
  section?: string;
  /** Show the welcome screen instead of the invitation */
  welcome?: boolean;
  /** The invitation language in the draft */
  lang?: Lang;
}
