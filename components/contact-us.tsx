import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ContactUs = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Contact Us</h2>
            <form className="max-w-md mx-auto">
                <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input id="name" placeholder="Your name" />
                </div>
                <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <Textarea id="message" placeholder="Your message" />
                </div>
                <Button className="w-full">Send Message</Button>
            </form>
        </div>
    )
}

export default ContactUs;