// Every icon the app uses, imported one file at a time.
//
// Importing from 'lucide-react-native' directly pulls all ~1,600 icons into
// the app bundle (the bundler cannot drop the unused ones), which costs
// download size on cheap phones. Add new icons here, by their file name
// from https://lucide.dev/icons, and import them from '@/components/icons'.
export { default as ArrowLeft } from 'lucide-react-native/icons/arrow-left';
export { default as ArrowRight } from 'lucide-react-native/icons/arrow-right';
export { default as BriefcaseBusiness } from 'lucide-react-native/icons/briefcase-business';
export { default as Check } from 'lucide-react-native/icons/check';
export { default as ClipboardList } from 'lucide-react-native/icons/clipboard-list';
export { default as House } from 'lucide-react-native/icons/house';
export { default as ImageOff } from 'lucide-react-native/icons/image-off';
export { default as MessageCircle } from 'lucide-react-native/icons/message-circle';
export { default as Repeat } from 'lucide-react-native/icons/repeat';
export { default as RotateCcw } from 'lucide-react-native/icons/rotate-ccw';
export { default as Search } from 'lucide-react-native/icons/search';
export { default as Settings } from 'lucide-react-native/icons/settings';
export { default as UserRound } from 'lucide-react-native/icons/user-round';

export type { LucideIcon as Icon } from 'lucide-react-native';
