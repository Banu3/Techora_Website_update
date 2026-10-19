/**
 * ============================================================================
 * TECHORA CONSULTANT — FEATURE TOGGLES & CONFIGURATION
 * ============================================================================
 * 
 * Single source of truth for staged section rollouts.
 * 
 * TODO LIST:
 * - [ ] Set `clientsEnabled` to `true` once corporate client case studies,
 *       verified partner badges, and authorized portal features are signed off.
 * ============================================================================
 */

export const features = {
  // Clients section activation switch
  // false = locked mode (disabled nav item with lock icon + tooltip, editorial locked page at /clients)
  // true = active mode (standard nav link and client network directory)
  clientsEnabled: false,
};

export default features;
