import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm Jessi, your FinitiixHub assistant! 🌟 I'm here to help you navigate our amazing platform where creativity meets opportunity. Whether you need help with posting jobs, creating gigs, uploading projects, or anything else - just ask me! What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const jessieResponses = {
    greeting: [
      "Hello! I'm Jessi, your friendly FinitiixHub guide! 😊 How can I help you today?",
      "Hey there! Welcome to FinitiixHub! I'm Jessi and I'm here to make your experience amazing! ✨",
      "Hi! It's Jessi here! Ready to explore all the cool features of FinitiixHub? 🚀"
    ],
    workzone: [
      "WorkZone is perfect for finding and posting freelance jobs! 💼 You can post jobs, browse available work, and connect with talented professionals. Need help getting started?",
      "In WorkZone, employers post jobs and freelancers apply! It's that simple! 🎯 You can filter by category, budget, and timeline to find the perfect match."
    ],
    bubblegigs: [
      "BubbleGigs is all about quick, creative video gigs! 🎥 Create 1-minute pitch videos to showcase your services. It's perfect for designers, editors, and creators!",
      "Love the energy of BubbleGigs! You can create engaging video gigs that really show off your personality and skills. Perfect for standing out! ⭐"
    ],
    projecthub: [
      "ProjectHub is your showcase space! 🏆 Upload your best work, share your achievements, and let others discover your talent. It's like your personal portfolio gallery!",
      "ProjectHub lets you display your projects beautifully with images, descriptions, and live demos. Perfect for impressing potential clients! 🌟"
    ],
    profile: [
      "Your profile is your digital business card! 💳 Make it shine with a great photo, compelling bio, and showcase your skills. Don't forget - you get a shareable link too!",
      "I love helping people create amazing profiles! Add your experience, skills, portfolio - everything that makes you unique! ✨"
    ],
    help: [
      "I'm here to help with anything FinitiixHub related! Try asking me about WorkZone, BubbleGigs, ProjectHub, profiles, or any feature you're curious about! 🤔",
      "Need assistance? I can guide you through posting jobs, creating gigs, uploading projects, setting up your profile, or using any other feature! 🚀"
    ],
    default: [
      "That's a great question! 🤗 FinitiixHub has so many features - WorkZone for jobs, BubbleGigs for creative services, ProjectHub for showcasing work, and more! What interests you most?",
      "Hmm, I want to make sure I give you the best answer! 💭 Could you tell me more about what you're looking for? Are you interested in finding work, hiring someone, or showcasing your skills?",
      "I'm still learning, but I'm super excited to help! 🌟 Try asking me about our main features like WorkZone, BubbleGigs, or ProjectHub - I know tons about those!"
    ]
  };

  const getJessieResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return jessieResponses.greeting[Math.floor(Math.random() * jessieResponses.greeting.length)];
    } else if (lowerMessage.includes('workzone') || lowerMessage.includes('job') || lowerMessage.includes('freelance')) {
      return jessieResponses.workzone[Math.floor(Math.random() * jessieResponses.workzone.length)];
    } else if (lowerMessage.includes('bubblegig') || lowerMessage.includes('gig') || lowerMessage.includes('video')) {
      return jessieResponses.bubblegigs[Math.floor(Math.random() * jessieResponses.bubblegigs.length)];
    } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('showcase')) {
      return jessieResponses.projecthub[Math.floor(Math.random() * jessieResponses.projecthub.length)];
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('bio') || lowerMessage.includes('about')) {
      return jessieResponses.profile[Math.floor(Math.random() * jessieResponses.profile.length)];
    } else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
      return jessieResponses.help[Math.floor(Math.random() * jessieResponses.help.length)];
    } else {
      return jessieResponses.default[Math.floor(Math.random() * jessieResponses.default.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate typing delay for more realistic experience
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getJessieResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 bg-gradient-primary hover:opacity-90 shadow-strong transition-all duration-300 hover:scale-105"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-12 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Chat with Jessi! 👋
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-80 h-96'
    }`}>
      <Card className="h-full shadow-strong border-2 border-primary/20">
        <CardHeader className="pb-2 bg-gradient-primary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border-2 border-white/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-white/20 text-white text-sm">J</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm">Jessi</CardTitle>
                <p className="text-xs opacity-90">AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="p-0 flex-1">
              <ScrollArea className="h-64 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      {message.isBot && (
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-primary text-white text-xs">
                            <Bot className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                          message.isBot
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-primary-foreground ml-auto'
                        }`}
                      >
                        {message.content}
                      </div>
                      {!message.isBot && (
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            <User className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="w-7 h-7 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-primary text-white text-xs">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg px-3 py-2 bg-muted text-foreground text-sm">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about FinitiixHub..."
                  className="flex-1 text-sm"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90"
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIChat;