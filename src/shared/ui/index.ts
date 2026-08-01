/**
 * Shared UI component barrel export.
 *
 * ALL UI components must be imported from '@shared/ui', never from deep paths.
 * This is the abstraction boundary between features and UI implementation.
 *
 * FORBIDDEN in feature modules:
 *   @mui/material | antd | @chakra-ui/react | sonner | react-toastify (directly)
 */
export * from './AppButton';
export * from './AppInput';
export * from './AppSelect';
export * from './AppCard';
export * from './AppTable';
export * from './AppModal';
export * from './AppDrawer';
export * from './AppLoader';
export * from './AppBadge';
export * from './AppAvatar';
export * from './AppTooltip';
export * from './AppTabs';
export * from './AppAccordion';
export * from './AppPagination';
