'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { deleteUserAction, resetPasswordAction } from '@/app/actions'
import { SubmitButton } from '@/components/submit-button'
import { Eye, EyeOff } from 'lucide-react'; 
import { FormMessage, Message } from '@/components/form-message'

export default function SettingsPage({ searchParams }: { searchParams: Message }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [showAccountButtons, setShowAccountButtons] = useState(false)
  const [showSecurityButtons, setShowSecurityButtons] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error messages

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, section: 'account' | 'security') => {
    setter(value)
    if (section === 'account') {
      setShowAccountButtons(true)
    } else {
      setShowSecurityButtons(true)
    }
  }

  const handleDiscard = (section: 'account' | 'security') => {
    if (section === 'account') {
      setName('')
      setEmail('')
      setProfilePicture('')
      setShowAccountButtons(false)
    } else {
      setNewPassword('')
      setConfirmNewPassword('')
      setShowSecurityButtons(false)
    }
  }

  console.log("SearchParams:", searchParams)
  return (
    <div className="ml-10 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      {/* Security Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className='relative'>
                <Input
                  id="password"
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => handleInputChange(setNewPassword, e.target.value, 'security')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '10px' }}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {!(newPassword === confirmNewPassword) && <small className='text-rose-600'>Passwords don't match</small>}
            </div>
            <div>
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <div className='relative'>
                <Input
                  id="confirmPassword"
                  name='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmNewPassword}
                  onChange={(e) => handleInputChange(setConfirmNewPassword, e.target.value, 'security')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '10px', top: '10px' }}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {!(newPassword === confirmNewPassword) && <small className='text-rose-600'>Passwords don't match</small>}
            </div>
            {/* Error Message Display */}
            <FormMessage message={searchParams} />
            {showSecurityButtons && (
              <div className="flex space-x-2">
                <Button onClick={() => handleDiscard('security')}>Discard</Button>
                <SubmitButton
                  pendingText="Submitting..."
                  disabled={!newPassword || !confirmNewPassword || !(newPassword === confirmNewPassword)}
                  formAction={resetPasswordAction}
                >
                  Submit
                </SubmitButton>
              </div>
            )}
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="deleteConfirmation">Type "DELETE" to confirm account deletion</Label>
            <Input
              id="deleteConfirmation"
              type="text"
              placeholder="DELETE"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={deleteConfirmation !== 'DELETE'} className='mt-2'>Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              {/* Error Message Display */}
              <FormMessage message={searchParams} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <form>
                  <SubmitButton 
                    variant="destructive" 
                    pendingText="Deleting Account..."
                    formAction={deleteUserAction}>
                    Delete Account
                  </SubmitButton>
                </form>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  )
}