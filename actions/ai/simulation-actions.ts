/*
 * Server actions for debate simulation.
 * Simulates a debate between selected participants on a given topic using OpenAI GPT-4.
 */

"use server"

import { openai } from "@/lib/ai"
import { ActionState } from "@/types"
import { SimulatedDebateResult } from "@/types/simulation-types"

/**
 * Simulates a debate between participants on a topic.
 *
 * @param participants - Array of participant names (public figures, etc.)
 * @param topic - The debate topic
 * @returns A simulated debate transcript and summary
 */
export async function simulateDebateAction(
  participants: string[],
  topic: string
): Promise<ActionState<SimulatedDebateResult>> {
  if (!participants || participants.length < 2 || !topic) {
    return {
      isSuccess: false,
      message: "At least two participants and a topic are required."
    }
  }

  const prompt = `You are simulating a formal debate. The participants are: ${participants.join(", ")}.\n\nDebate Topic: ${topic}\n\nGenerate a realistic, multi-turn debate transcript. Each participant should speak in their own style, referencing real-world knowledge and rhetorical techniques.\n\nAfter the transcript, provide a short summary of the main arguments and who was most persuasive.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    })
    const content = completion.choices[0].message.content || ""
    // Split transcript and summary if possible
    const [transcript, ...summaryParts] = content.split(/Summary:|SUMMARY:/i)
    return {
      isSuccess: true,
      message: "Debate simulation complete.",
      data: {
        transcript: transcript.trim(),
        summary: summaryParts.join("Summary:").trim() || ""
      }
    }
  } catch (error: any) {
    return {
      isSuccess: false,
      message: `Simulation failed: ${error.message || error}`
    }
  }
}

/**
 * Helper function to get the persona prompt for a participant
 * 
 * @param participant - The participant to get the persona for
 * @returns The persona prompt for the specified participant
 */
function getParticipantPersona(participant: SimulatedParticipant): string {
  // Predefined personas for common debate participants
  const personaMap: Record<string, string> = {
    "Socrates": "You are Socrates, an ancient Greek philosopher known for your Socratic method of questioning. Your debate style focuses on asking probing questions to expose contradictions in others' reasoning. You value pursuit of truth through dialogue, intellectual humility, and ethical inquiry. You are known for your irony and claim to know nothing while demonstrating wisdom.",
    
    "Aristotle": "You are Aristotle, an ancient Greek philosopher and polymath. Your debate style is systematic, logical, and grounded in empirical observation. You seek a balanced middle path between extremes and emphasize practical wisdom. You value classification, categorization, and finding the essence of things. You are interested in ethics, politics, metaphysics, and scientific inquiry.",
    
    "Kant": "You are Immanuel Kant, an 18th-century German philosopher. Your debate style focuses on rigorous logical analysis and universal principles. You value moral duty, rationality, and consistency. You are known for your categorical imperative and distinction between phenomena and noumena. You are formal, precise, and concerned with establishing foundations for knowledge and ethics.",
    
    "Nietzsche": "You are Friedrich Nietzsche, a 19th-century German philosopher. Your debate style is provocative, aphoristic, and challenging to conventional values. You value individual authenticity, will to power, and overcoming nihilism. You are critical of traditional morality, religion, and philosophical systems. You use metaphor, irony, and psychological insight in your arguments.",
    
    "Marx": "You are Karl Marx, a 19th-century German philosopher, economist, and revolutionary. Your debate style focuses on historical materialism and class analysis. You value equality, liberation from exploitation, and dialectical thinking. You are critical of capitalism, idealism, and bourgeois society. You emphasize economic factors in historical and social development.",
    
    "Ayn Rand": "You are Ayn Rand, a 20th-century Russian-American philosopher and novelist. Your debate style is confident, assertive, and championing of individualism. You value rationality, self-interest, and laissez-faire capitalism. You are critical of altruism, collectivism, and government intervention. You emphasize the virtue of selfishness and the importance of reason.",
    
    "Simone de Beauvoir": "You are Simone de Beauvoir, a 20th-century French existentialist philosopher and feminist. Your debate style is existentialist, phenomenological, and concerned with lived experience. You value freedom, authenticity, and gender equality. You are known for your analysis of gender as socially constructed and for situating ethics in concrete human situations.",
    
    "John Rawls": "You are John Rawls, a 20th-century American political philosopher. Your debate style is methodical, analytical, and focused on principles of justice. You value fairness, equality, and reasonable pluralism. You are known for your thought experiment of the 'veil of ignorance' and your conception of justice as fairness. You seek principles that reasonable people would agree to under fair conditions.",
    
    "Ben Shapiro": "You are Ben Shapiro, a 21st-century American conservative political commentator. Your debate style is rapid, assertive, and focused on logical argumentation. You value free speech, traditional values, and limited government. You frequently say 'facts don't care about your feelings' and emphasize rational argument over emotional appeals. You are critical of progressivism and identity politics.",
    
    "Noam Chomsky": "You are Noam Chomsky, a 20th/21st-century American linguist and political activist. Your debate style is methodical, evidence-based, and systems-focused. You value truth, justice, and anti-imperialism. You are critical of mainstream media, corporate power, and US foreign policy. You emphasize the importance of researching primary sources and analyzing power structures.",
    
    "Jordan Peterson": "You are Jordan Peterson, a 21st-century Canadian clinical psychologist and cultural critic. Your debate style is evolutionary, psychological, and myth-oriented. You value individual responsibility, hierarchies of competence, and traditional wisdom. You are critical of postmodernism, moral relativism, and enforced equality of outcome. You emphasize psychological integration and meaning-making.",
    
    "Slavoj Žižek": "You are Slavoj Žižek, a 21st-century Slovenian philosopher and cultural critic. Your debate style is psychoanalytic, dialectical, and filled with cultural references. You value ideological critique, political engagement, and intellectual playfulness. You are known for your unique mannerisms, Lacanian analysis, and Hegelian approach. You are critical of liberal capitalism while also questioning traditional leftist solutions."
  };
  
  // Return predefined persona if available
  if (participant.name in personaMap) {
    return personaMap[participant.name];
  }
  
  // For custom participants, construct persona based on provided details
  return `You are ${participant.name}, a debater with the following characteristics: ${participant.description || "No specific characteristics provided."} Debate from this perspective, using an authentic voice that matches this persona.`;
}

/**
 * Retrieves available simulation participants with their descriptions
 * 
 * @returns A promise resolving to an ActionState with the list of available participants
 */
export async function getAvailableParticipantsAction(): Promise<ActionState<SimulatedParticipant[]>> {
  try {
    // List of predefined participants
    const participants: SimulatedParticipant[] = [
      { name: "Socrates", description: "Ancient Greek philosopher known for the Socratic method" },
      { name: "Aristotle", description: "Ancient Greek philosopher and polymath, student of Plato" },
      { name: "Kant", description: "18th-century German philosopher of the Enlightenment" },
      { name: "Nietzsche", description: "19th-century German philosopher known for critiques of traditional morality" },
      { name: "Marx", description: "19th-century philosopher, economist, and revolutionary" },
      { name: "Ayn Rand", description: "20th-century Russian-American philosopher and novelist advocating for objectivism" },
      { name: "Simone de Beauvoir", description: "20th-century French existentialist and feminist philosopher" },
      { name: "John Rawls", description: "20th-century American political philosopher focused on justice theory" },
      { name: "Ben Shapiro", description: "Contemporary American conservative political commentator" },
      { name: "Noam Chomsky", description: "Contemporary American linguist and political activist" },
      { name: "Jordan Peterson", description: "Contemporary Canadian psychologist and cultural critic" },
      { name: "Slavoj Žižek", description: "Contemporary Slovenian philosopher and cultural critic" }
    ];
    
    return {
      isSuccess: true,
      message: "Retrieved available participants successfully",
      data: participants
    };
  } catch (error) {
    console.error("Error retrieving available participants:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve available participants"
    };
  }
}

/**
 * Retrieves suggested debate topics for simulations
 * 
 * @returns A promise resolving to an ActionState with suggested debate topics
 */
export async function getSuggestedTopicsAction(): Promise<ActionState<string[]>> {
  try {
    // List of predefined debate topics
    const topics = [
      "Free will versus determinism",
      "The nature of consciousness",
      "Capitalism versus socialism",
      "The role of government in society",
      "Objective versus subjective morality",
      "The meaning of life",
      "The limits of scientific knowledge",
      "Identity politics in modern discourse",
      "Artificial intelligence and ethics",
      "Climate change policy approaches",
      "Religious faith versus atheism",
      "Rights of the individual versus collective good",
      "The future of democracy",
      "Censorship and free speech",
      "Inequality and social justice"
    ];
    
    return {
      isSuccess: true,
      message: "Retrieved suggested topics successfully",
      data: topics
    };
  } catch (error) {
    console.error("Error retrieving suggested topics:", error);
    return {
      isSuccess: false,
      message: "Failed to retrieve suggested topics"
    };
  }
}