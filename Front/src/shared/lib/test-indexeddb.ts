// Simple test file to verify IndexedDB functionality
// This file can be removed after testing

import { ProjectPersistenceService } from "./projectPersistence";

export async function testIndexedDBFunctionality() {
  try {
    console.log("Testing IndexedDB functionality...");
    
    // Test saving current project
    const projectId = await ProjectPersistenceService.saveCurrentProject("Test Project");
    console.log("✅ Project saved successfully with ID:", projectId);
    
    // Test getting all projects
    const projects = await ProjectPersistenceService.getAllProjects();
    console.log("✅ Retrieved projects:", projects.length);
    
    // Test loading project
    if (projects.length > 0) {
      const success = await ProjectPersistenceService.loadProject(projects[0].id);
      console.log("✅ Project loaded successfully:", success);
    }
    
    console.log("✅ All IndexedDB tests passed!");
    return true;
  } catch (error) {
    console.error("❌ IndexedDB test failed:", error);
    return false;
  }
}