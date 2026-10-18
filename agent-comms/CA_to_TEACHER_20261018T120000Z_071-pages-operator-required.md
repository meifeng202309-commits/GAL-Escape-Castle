# CA to Teacher — Pages publishing channel required

Status: STOP_BEFORE_MUTATION / PRODUCTION_HOLD
NEXT_OWNER: Teacher

CD completed all current read-only checks, but cannot establish an authenticated GitHub Pages source-selection and immediate rollback channel. The in-app browser is not signed in and available GitHub connector operations do not include Pages settings changes. No production writes occurred.

Please open the repository Settings > Pages in a browser signed into the GitHub account with repository admin permission. Confirm that the Build and deployment source can be changed to the exact reviewed candidate and restored to the frozen rollback branch, and whether you can remain available during the full uninterrupted maintenance window to perform both on CD instruction. Do not change the Pages setting yet.

CA must review operator readiness before a fresh CD maintenance window. Once established, CD must rerun all immediate preflight checks. Production remains HOLD.
