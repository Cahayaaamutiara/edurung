import { writable } from 'svelte/store';
import type { Material, MaterialProgress, MaterialSection } from '../types';
import { getMaterialsBySubject, getMaterialById, getAllMaterials } from '../data/materialData';

// Helper function to generate sections from legacy content
function generateSectionsFromContent(material: Material): MaterialSection[] {
  if (!material.content) {
    return [{
      id: 'default-content',
      title: 'Konten Materi',
      content: 'Materi sedang dalam proses pengembangan. Silakan cek kembali nanti.',
      type: 'text',
      order: 1
    }];
  }

  const sections: MaterialSection[] = [];
  const contentLines = material.content.split('\n');
  let currentSection: MaterialSection | null = null;
  let sectionCounter = 0;

  for (const line of contentLines) {
    const trimmedLine = line.trim();
    
    // Check for headings
    if (trimmedLine.startsWith('## ')) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Create new section
      sectionCounter++;
      currentSection = {
        id: `section-${sectionCounter}`,
        title: trimmedLine.replace('## ', ''),
        content: '',
        type: 'text',
        order: sectionCounter
      };
    } else if (currentSection && trimmedLine) {
      // Add content to current section
      currentSection.content += (currentSection.content ? '\n' : '') + trimmedLine;
    } else if (!currentSection && trimmedLine) {
      // First content without heading
      sectionCounter++;
      currentSection = {
        id: `section-${sectionCounter}`,
        title: material.title,
        content: trimmedLine,
        type: 'text',
        order: sectionCounter
      };
    }
  }

  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }

  // Ensure at least one section exists
  if (sections.length === 0) {
    sections.push({
      id: 'default-section',
      title: material.title,
      content: material.content,
      type: 'text',
      order: 1
    });
  }

  return sections;
}

// Material progress store
export const materialProgress = writable<MaterialProgress[]>([]);

// Current material being viewed
export const currentMaterial = writable<Material | null>(null);

// Loading state
export const isLoadingMaterial = writable<boolean>(false);

// Initialize material progress from localStorage
if (typeof window !== 'undefined') {
  const storedProgress = localStorage.getItem('edu-ruang-material-progress');
  if (storedProgress) {
    try {
      materialProgress.set(JSON.parse(storedProgress));
    } catch (e) {
      localStorage.removeItem('edu-ruang-material-progress');
    }
  }
}

// Subscribe to material progress changes to save to localStorage
materialProgress.subscribe((progress) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('edu-ruang-material-progress', JSON.stringify(progress));
  }
});

export const materialFunctions = {
  /**
   * Get materials for a specific subject with guaranteed content
   */
  getMaterialsBySubject: (subjectId: string): Material[] => {
    const materials = getMaterialsBySubject(subjectId);
    
    // Ensure all materials have complete content structure
    return materials.map(material => {
      if (!material.sections || material.sections.length === 0) {
        // Auto-generate sections from legacy content if needed
        const sections = generateSectionsFromContent(material);
        return { ...material, sections };
      }
      return material;
    }).filter(material => 
      // Filter out materials without proper content
      material.content || (material.sections && material.sections.length > 0)
    );
  },

  /**
   * Get a specific material by ID with content validation
   */
  getMaterial: (materialId: string): Material | undefined => {
    const material = getMaterialById(materialId);
    if (!material) return undefined;
    
    // Validate and enhance material content
    if (!material.sections || material.sections.length === 0) {
      const sections = generateSectionsFromContent(material);
      return { ...material, sections };
    }
    
    return material;
  },

  /**
   * Set current material
   */
  setCurrentMaterial: (material: Material | null): void => {
    currentMaterial.set(material);
  },

  /**
   * Start reading a material
   */
  startReading: (materialId: string, userId: string): void => {
    materialProgress.update(progress => {
      const existingProgress = progress.find(p => p.materialId === materialId && p.userId === userId);
      
      if (!existingProgress) {
        progress.push({
          materialId,
          userId,
          isCompleted: false,
          timeSpent: 0,
          lastAccessedAt: new Date()
        });
      } else {
        existingProgress.lastAccessedAt = new Date();
      }
      
      return progress;
    });
  },

  /**
   * Complete a material
   */
  completeMaterial: (materialId: string, userId: string, timeSpent: number): void => {
    materialProgress.update(progress => {
      const existingProgress = progress.find(p => p.materialId === materialId && p.userId === userId);
      
      if (existingProgress) {
        existingProgress.isCompleted = true;
        existingProgress.timeSpent = timeSpent;
        existingProgress.completedAt = new Date();
        existingProgress.lastAccessedAt = new Date();
      } else {
        progress.push({
          materialId,
          userId,
          isCompleted: true,
          timeSpent,
          lastAccessedAt: new Date(),
          completedAt: new Date()
        });
      }
      
      return progress;
    });
  },

  /**
   * Update time spent on material
   */
  updateTimeSpent: (materialId: string, userId: string, additionalTime: number): void => {
    materialProgress.update(progress => {
      const existingProgress = progress.find(p => p.materialId === materialId && p.userId === userId);
      
      if (existingProgress) {
        existingProgress.timeSpent += additionalTime;
        existingProgress.lastAccessedAt = new Date();
      }
      
      return progress;
    });
  },

  /**
   * Get progress for a specific material
   */
  getMaterialProgress: (materialId: string, userId: string): MaterialProgress | undefined => {
    let progress: MaterialProgress | undefined;
    materialProgress.subscribe(progressList => {
      progress = progressList.find(p => p.materialId === materialId && p.userId === userId);
    })();
    return progress;
  },

  /**
   * Get all completed materials for a user
   */
  getCompletedMaterials: (userId: string): Material[] => {
    let completedMaterialIds: string[] = [];
    materialProgress.subscribe(progressList => {
      completedMaterialIds = progressList
        .filter(p => p.userId === userId && p.isCompleted)
        .map(p => p.materialId);
    })();

    const allMaterials = getAllMaterials();
    return allMaterials.filter(material => completedMaterialIds.includes(material.id));
  },

  /**
   * Get progress statistics for a subject
   */
  getSubjectProgress: (subjectId: string, userId: string): { completed: number; total: number; percentage: number } => {
    const subjectMaterials = getMaterialsBySubject(subjectId);
    let completedCount = 0;

    materialProgress.subscribe(progressList => {
      completedCount = progressList.filter(p => 
        p.userId === userId && 
        p.isCompleted && 
        subjectMaterials.some(m => m.id === p.materialId)
      ).length;
    })();

    const total = subjectMaterials.length;
    const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      completed: completedCount,
      total,
      percentage
    };
  },

  /**
   * Get recommended next material based on prerequisites
   */
  getNextRecommendedMaterial: (subjectId: string, userId: string): Material | null => {
    const subjectMaterials = materialFunctions.getMaterialsBySubject(subjectId);
    let completedMaterialIds: string[] = [];

    materialProgress.subscribe(progressList => {
      completedMaterialIds = progressList
        .filter(p => p.userId === userId && p.isCompleted)
        .map(p => p.materialId);
    })();

    // Find the first material that hasn't been completed and has prerequisites met
    for (const material of subjectMaterials.sort((a, b) => a.order - b.order)) {
      if (completedMaterialIds.includes(material.id)) continue;

      // Check if prerequisites are met
      if (material.prerequisites) {
        const prerequisitesMet = material.prerequisites.every(prereqId => 
          completedMaterialIds.includes(prereqId)
        );
        if (!prerequisitesMet) continue;
      }

      return material;
    }

    return null;
  },

  /**
   * Validate material content and ensure completeness
   */
  validateMaterialContent: (material: Material): boolean => {
    // Check if material has content
    if (!material.content && (!material.sections || material.sections.length === 0)) {
      return false;
    }

    // Check if sections have content
    if (material.sections) {
      return material.sections.every(section => 
        section.content && section.content.trim().length > 0
      );
    }

    return true;
  },

  /**
   * Get material with guaranteed content (auto-generates if needed)
   */
  getMaterialWithContent: (materialId: string): Material | undefined => {
    const material = materialFunctions.getMaterial(materialId);
    if (!material) return undefined;

    // Validate content
    if (!materialFunctions.validateMaterialContent(material)) {
      // Auto-generate basic content structure
      const enhancedMaterial = {
        ...material,
        sections: material.sections && material.sections.length > 0 
          ? material.sections 
          : generateSectionsFromContent(material)
      };
      
      return enhancedMaterial;
    }

    return material;
  }
};