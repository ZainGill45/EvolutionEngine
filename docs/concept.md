Evolution Engine is a local-first desktop application built around a pretty simple idea: I want to use AI to make myself more capable without AI.

That distinction is the core of the product. Most AI assistants are built around a loop where I have a problem and the AI removes the problem. I want Evolution Engine to work differently. I run into something I do not understand, the system helps me build that understanding, checks whether I actually understand it, brings it back later, and eventually gets me to the point where I no longer need help with it.

A good principle for the entire application is that the system succeeds when I need the system less.

The other important principle is to never confuse exposure with mastery. Reading an explanation does not mean I understand something. Agreeing with an explanation does not mean I understand it. Getting the right answer after several hints is not the same as being able to retrieve it cold. Recognizing a solution is not the same as generating one myself, and being able to use a concept exactly the way it was demonstrated is much weaker evidence than being able to use it somewhere unfamiliar.

The problem I am trying to solve is not that AI is bad at explaining things. It is often extremely good at explaining things. The problem is that most AI systems are optimized for immediate completion.

If I am stuck, the model wants to unstick me. If I ask how something works, it wants to explain it. If my code is broken, it wants to repair it. If I cannot derive the answer, it wants to derive it for me.

That is useful if my goal is productivity, but it can remove a lot of the mental work that actually seems to produce durable learning. Prediction, retrieval, failure, forming a hypothesis, debugging it, reconsidering what I thought, reconstructing the idea, and applying it again are all part of actually learning something.

Evolution Engine changes the objective.

I should not have to constantly tell the model, "Don't tell me yet," "Make me think," "Give me a hint," "Quiz me," "Challenge my explanation," or "Don't write the code for me." Those behaviours should be part of the system itself.

The basic experience starts with a learning topic. I might create topics for HTTP, C#, linear algebra, HVAC electrical fundamentals, SQL Server, computer networking, or whatever else I am trying to learn. Each topic becomes a persistent learning environment rather than a disposable chat. The conversation stays on disk, I can close the application, and I can come back later and keep going.

I do not want the conversation history itself to become the learner model, though. The chat is evidence of what happened. The learner state should be the application's current understanding of what I appear to know.

For example, a conversation about CORS might show that I understand same-origin restrictions, that I previously thought the server itself blocked the response, that I later corrected that misconception, and that I can explain why the browser is actually the thing enforcing it. But maybe I still have not demonstrated that understanding in a new situation.

That structured state is much more useful than repeatedly throwing a giant conversation history back into the model and hoping it figures out where I am.

The core loop I have in mind is basically this: the conversation produces evidence, that evidence updates my learner state, the learner state influences what the system does next, that interaction produces more evidence, and the cycle keeps going.

Over time, that loop becomes the actual Evolution Engine.

I think the hardest technical problem in this project probably has very little to do with Electron, databases, or connecting to different model providers. The difficult part is figuring out how to make general-purpose LLMs consistently behave like teachers instead of answer machines.

I do not think that should come down to one gigantic system prompt. I want to surround the model with structure instead. There should be a relatively small permanent pedagogical constitution, specialized teaching skills, relevant learner state passed in when needed, a real separation between teaching and assessment, and application-level constraints for behaviours that are important enough that I do not want to leave them entirely up to the model.

The teaching strategies themselves can be varied. Sometimes the model should try to figure out what my current mental model is. Sometimes it should ask questions. Sometimes it should explain. Sometimes it should give progressively stronger hints. Sometimes it should probe a misconception, make me retrieve something from memory, generate an exercise, test whether I can transfer an idea into a new situation, or assess whether I actually know it.

The important shift is that explaining the answer is one tool available to the system. It is not the default response every time I show signs of confusion.

At the same time, I absolutely do not want Evolution Engine to turn into one of those infuriating tutors that responds to everything with, "What do you think?"

Sometimes I genuinely do not know enough to make progress. Sometimes I am missing a prerequisite. Sometimes I have already exhausted what I can reasonably figure out myself.

The principle I want is: do not remove productive struggle, but do not preserve unproductive struggle.

Figuring out the difference between those two things might eventually become one of the most interesting intelligence problems in the entire application.

A hint ladder seems like one practical way of dealing with that. I try the problem myself first. If I am stuck, the system can point me in the right direction. If that is not enough, it can remind me of a relevant concept. Then maybe it gives me part of the reasoning, walks me through more of the solution, and eventually just explains the complete answer if that is what I need.

The important part is that the system remembers how much help I needed. If I solve something independently, that should count as stronger evidence than solving it after four hints.

Another behaviour I want to encourage is prediction before explanation.

If I am looking at a piece of code, for example, the system should often ask me what I think will happen before telling me. Once I see the actual result, it can ask me why my prediction was right or wrong.

That exposes my mental model. Instead of only seeing whether I recognize the explanation after hearing it, the system gets evidence about what I actually believed beforehand.

Eventually I also want the application to have different learning modes.

Explore mode can be loose and let me investigate whatever I want. Teach mode can focus on constructing understanding and give me plenty of help. Practice mode can reduce the amount of help available. Assess mode can test me with little or no assistance. Review mode can deliberately bring back things I learned earlier.

Separating these matters because the context changes what an answer actually means. Getting something right while the system is actively teaching me should not count the same as getting it right during an assessment with no help.

The long-term retention loop is where I think Evolution Engine really becomes different from a well-prompted chatbot.

If I demonstrate that I understand something today, the system should bring it back later. Maybe tomorrow. Maybe several days later. Maybe weeks later.

The questions should also change as time passes.

If I learn CORS, I do not want the system to repeatedly ask, "What is CORS?" It might instead ask why CORS does not stop curl, what happens when the allowed origin does not match the requesting origin, whether enabling CORS means arbitrary servers can suddenly access an API, or how I would configure an API that is supposed to be used by browsers from two specific domains.

What I actually care about is whether the knowledge became flexible. I do not care whether I memorized a definition.

For the technical stack, what I currently have in mind is Electron, TypeScript, Effect, React, Tailwind with ChadCN UI, shadcn/lint, Zod, SQLite, filesystem-backed chat and learning history, multiple LLM providers, and support for local or personally hosted models.

I think using SQLite everywhere initially keeps persistence simpler. I would rather have one general persistence model than split things between several databases before I actually have a reason to. SQLite can work locally and on a server. If the application eventually grows to the point where SQLite itself becomes a real limitation, that seems like a much better time to reconsider the database.

I also want the LLM layer to be provider-independent from the beginning.

The educational parts of the application should not care whether the response came from OpenAI, Anthropic, Gemini, Ollama, llama.cpp, or some OpenAI-compatible endpoint. Providers should live behind a common interface so the teaching system, learner model, and evaluation infrastructure are not coupled to whichever model happens to be best right now.

I still like the idea of keeping complete conversation history in files while using SQLite for structured state rather than forcing absolutely everything into relational tables.

SQLite makes sense for things I actually need to query, such as topics, concepts, assessments, evidence, review schedules, conversation indexes, and provider configuration. Files make sense for durable sequential records like full conversations.

Anything crossing an untrusted boundary should go through Zod. That includes things loaded from disk, structured LLM output, IPC messages, imported learning data, and server responses.

For the first milestone, I want to deliberately ignore most of the ambitious stuff.

I do not need spaced repetition yet. I do not need a knowledge graph, embeddings, sophisticated mastery scoring, cloud hosting, accounts, collaboration, or some enormous memory architecture.

All of those things depend on answering a much more basic question first:

Can I make Evolution Engine consistently produce an interaction that actually feels like learning instead of answer retrieval?

I think the first milestone should be The Learning Thread.

I should be able to open the application, create a topic like HTTP, choose an LLM provider, enter that learning thread, and have a persistent conversation with an AI that is trying to develop my understanding rather than simply finish things for me.

The conversation should persist locally. I should be able to close the entire application, open it again, see the HTTP topic still sitting there, reopen the same conversation, and continue from where I stopped.

For that first version, the teaching system only needs a handful of explicit behaviours. It should be able to ask, hint, explain, challenge, and test.

The model gets the teaching constitution, the current topic, and enough recent conversation context to continue coherently.

I do not need all of the future educational infrastructure to exist yet. What I care about is whether opening Evolution Engine actually feels meaningfully different from opening a normal AI assistant.

That first version also gives me somewhere concrete to develop the part of the application that matters.

I can use Evolution Engine myself to learn HTTP, C#, networking, HVAC, or whatever else I happen to be studying. I can deliberately give it wrong explanations and see whether it catches them. I can get stuck and see whether it knows when to keep pushing me and when to finally explain. I can swap models, change prompts, modify teaching skills, and start building evaluations around the situations where the tutor gives too much away or becomes obnoxiously Socratic.

Once that interaction actually works, the second milestone can introduce the smallest possible retention loop.

A conversation produces one learned concept. The system records it. It schedules it. It brings it back later. It assesses me without assistance. It records what happened and schedules the next review.

At that point, Evolution Engine stops being a carefully tuned AI tutor and starts becoming something more interesting.

It becomes a system that actually participates in my learning across time.

That is the point where I think the central idea of Evolution Engine becomes real.